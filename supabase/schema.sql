-- ========================================
--   BẢNG 1: profiles
--   Liên kết với auth.users của Supabase
-- ========================================
create table profiles (
  id          uuid references auth.users primary key,
  email       text,
  display_name text,
  avatar_url   text,
  auth_provider text not null default 'email',
  password_hash text,
  created_at   timestamptz default now()
);

-- ========================================
--   BẢNG 2: posts
--   Nội dung bài viết
-- ========================================
create table posts (
  id           uuid primary key default gen_random_uuid(),
  title        text        not null,
  slug         text        unique not null,
  content      text,
  category     text,
  published_at timestamptz,
  created_at   timestamptz default now()
);

-- ========================================
--   BẢNG 3: comments
--   Bình luận — liên kết posts + profiles
-- ========================================
create table comments (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid references posts   on delete cascade,
  user_id    uuid references profiles on delete cascade,
  body       text        not null,
  created_at timestamptz default now()
);

-- ========================================
--   BẢNG 4: subscribers
--   Email newsletter
-- ========================================
create table subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text unique  not null,
  confirmed  boolean      default false,
  created_at timestamptz  default now()
);

-- Bật RLS cho các bảng cần bảo vệ
alter table posts     enable row level security;
alter table comments  enable row level security;
alter table profiles  enable row level security;
alter table subscribers enable row level security;

-- ─── POSTS ────────────────────────────────────────
-- Ai cũng đọc được bài viết (public blog)
create policy "public read posts"
  on posts for select
  using (true);

-- ─── COMMENTS ─────────────────────────────────────
-- Ai cũng đọc được comment
create policy "read all comments"
  on comments for select
  using (true);

-- Phải login mới comment được, và chỉ insert cho chính mình
create policy "login to comment"
  on comments for insert
  with check (auth.uid() = user_id);

-- Chỉ xóa được comment của chính mình
create policy "delete own comment"
  on comments for delete
  using (auth.uid() = user_id);

-- ─── PROFILES ─────────────────────────────────────
-- Ai cũng xem được profile công khai
create policy "public read profiles"
  on profiles for select
  using (true);

-- Chỉ tự update profile của mình
create policy "update own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- ─── SUBSCRIBERS ──────────────────────────────────
-- Chỉ insert (đăng ký), không cho đọc list email
create policy "insert subscriber"
  on subscribers for insert
  with check (true);


create extension if not exists pgcrypto;

create or replace function public.google_oauth_password_hash(
  p_user_id uuid,
  p_email text
)
returns text
language sql
stable
set search_path = public, extensions
as $$
  select 'oauth_google_sha256$' || encode(digest(p_user_id::text || ':' || coalesce(p_email, ''), 'sha256'), 'hex')
$$;

-- Khi user đăng ký, tự động tạo row trong profiles
create or replace function handle_new_user()
returns trigger as $$
declare
  v_provider text;
begin
  v_provider := coalesce(new.raw_app_meta_data->>'provider', 'email');

  insert into public.profiles (id, email, display_name, avatar_url, auth_provider, password_hash)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url',
    v_provider,
    case
      when v_provider = 'google' then public.google_oauth_password_hash(new.id, new.email)
      else null
    end
  )
  on conflict (id) do update set
    email = excluded.email,
    display_name = coalesce(public.profiles.display_name, excluded.display_name),
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
    auth_provider = excluded.auth_provider,
    password_hash = coalesce(public.profiles.password_hash, excluded.password_hash);

  return new;
end;
$$ language plpgsql security definer set search_path = public;

create or replace function public.ensure_google_profile()
returns void as $$
declare
  v_user auth.users%rowtype;
  v_provider text;
begin
  select *
  into v_user
  from auth.users
  where id = auth.uid();

  if v_user.id is null then
    raise exception 'No authenticated user found';
  end if;

  v_provider := coalesce(v_user.raw_app_meta_data->>'provider', '');

  if v_provider <> 'google' then
    raise exception 'Authenticated user provider is %, expected google', v_provider;
  end if;

  insert into public.profiles (id, email, display_name, avatar_url, auth_provider, password_hash)
  values (
    v_user.id,
    v_user.email,
    coalesce(v_user.raw_user_meta_data->>'full_name', v_user.raw_user_meta_data->>'name'),
    v_user.raw_user_meta_data->>'avatar_url',
    'google',
    public.google_oauth_password_hash(v_user.id, v_user.email)
  )
  on conflict (id) do update set
    email = excluded.email,
    display_name = coalesce(public.profiles.display_name, excluded.display_name),
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
    auth_provider = 'google',
    password_hash = coalesce(public.profiles.password_hash, excluded.password_hash);
end;
$$ language plpgsql security definer set search_path = public, auth;

grant execute on function public.ensure_google_profile() to authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
