CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE profiles (
  id uuid REFERENCES auth.users PRIMARY KEY,
  email text,
  display_name text,
  avatar_url text,
  auth_provider text NOT NULL DEFAULT 'email',
  app_role text NOT NULL DEFAULT 'user' CHECK (app_role IN ('user', 'author', 'admin')),
  password_hash text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  thumbnail_url text,
  summary text,
  status text DEFAULT 'draft'
);

CREATE TABLE comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts ON DELETE CASCADE,
  user_id uuid REFERENCES profiles ON DELETE CASCADE,
  body text NOT NULL,
  created_at timestamptz DEFAULT now(),
  is_approved boolean DEFAULT false
);

CREATE TABLE subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  confirmed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read posts"
  ON posts FOR SELECT
  USING (true);

CREATE POLICY "read all comments"
  ON comments FOR SELECT
  USING (true);

CREATE POLICY "login to comment"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "delete own comment"
  ON comments FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "public read profiles"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "insert subscriber"
  ON subscribers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "public read categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "anyone can send contact"
  ON contacts FOR INSERT
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.google_oauth_password_hash(
  p_user_id uuid,
  p_email text
)
RETURNS text
LANGUAGE sql
STABLE
SET search_path = public, extensions
AS $$
  SELECT 'oauth_google_sha256$' || encode(digest(p_user_id::text || ':' || coalesce(p_email, ''), 'sha256'), 'hex')
$$;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_provider text;
BEGIN
  v_provider := coalesce(new.raw_app_meta_data->>'provider', 'email');

  INSERT INTO public.profiles (id, email, display_name, avatar_url, auth_provider, password_hash)
  VALUES (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url',
    v_provider,
    CASE
      WHEN v_provider = 'google' THEN public.google_oauth_password_hash(new.id, new.email)
      ELSE NULL
    END
  )
  ON CONFLICT (id) DO UPDATE SET
    email = excluded.email,
    display_name = coalesce(public.profiles.display_name, excluded.display_name),
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
    auth_provider = excluded.auth_provider,
    password_hash = coalesce(public.profiles.password_hash, excluded.password_hash);

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.ensure_google_profile()
RETURNS void AS $$
DECLARE
  v_user auth.users%rowtype;
  v_provider text;
BEGIN
  SELECT *
  INTO v_user
  FROM auth.users
  WHERE id = auth.uid();

  IF v_user.id IS NULL THEN
    RAISE EXCEPTION 'No authenticated user found';
  END IF;

  v_provider := coalesce(v_user.raw_app_meta_data->>'provider', '');

  IF v_provider <> 'google' THEN
    RAISE EXCEPTION 'Authenticated user provider is %, expected google', v_provider;
  END IF;

  INSERT INTO public.profiles (id, email, display_name, avatar_url, auth_provider, password_hash)
  VALUES (
    v_user.id,
    v_user.email,
    coalesce(v_user.raw_user_meta_data->>'full_name', v_user.raw_user_meta_data->>'name'),
    v_user.raw_user_meta_data->>'avatar_url',
    'google',
    public.google_oauth_password_hash(v_user.id, v_user.email)
  )
  ON CONFLICT (id) DO UPDATE SET
    email = excluded.email,
    display_name = coalesce(public.profiles.display_name, excluded.display_name),
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
    auth_provider = 'google',
    password_hash = coalesce(public.profiles.password_hash, excluded.password_hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth;

GRANT EXECUTE ON FUNCTION public.ensure_google_profile() TO authenticated;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
