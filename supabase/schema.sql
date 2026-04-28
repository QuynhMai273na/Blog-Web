-- ========================================
--   BẢNG 1: profiles
--   Liên kết với auth.users của Supabase
-- ========================================
create table profiles (
  id          uuid references auth.users primary key,
  display_name text,
  avatar_url   text,
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

-- ─── SUBSCRIBERS ──────────────────────────────────
-- Chỉ insert (đăng ký), không cho đọc list email
create policy "insert subscriber"
  on subscribers for insert
  with check (true);


-- Khi user đăng ký, tự động tạo row trong profiles
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
