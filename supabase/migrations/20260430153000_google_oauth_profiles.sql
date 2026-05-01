CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS auth_provider TEXT NOT NULL DEFAULT 'email',
  ADD COLUMN IF NOT EXISTS password_hash TEXT;

CREATE OR REPLACE FUNCTION public.google_oauth_password_hash(
  p_user_id UUID,
  p_email TEXT
)
RETURNS TEXT
LANGUAGE SQL
STABLE
SET search_path = public, extensions
AS $$
  SELECT 'oauth_google_sha256$' || encode(digest(p_user_id::text || ':' || coalesce(p_email, ''), 'sha256'), 'hex')
$$;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_provider TEXT;
BEGIN
  v_provider := coalesce(new.raw_app_meta_data->>'provider', 'email');

  INSERT INTO public.profiles (
    id,
    email,
    display_name,
    avatar_url,
    auth_provider,
    password_hash
  )
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
RETURNS VOID AS $$
DECLARE
  v_user auth.users%ROWTYPE;
  v_provider TEXT;
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

  INSERT INTO public.profiles (
    id,
    email,
    display_name,
    avatar_url,
    auth_provider,
    password_hash
  )
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

CREATE POLICY "insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
