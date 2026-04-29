-- 1. Tạo bảng Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Cập nhật posts (Xóa cột cũ nếu có và thêm mới)
ALTER TABLE posts DROP COLUMN IF EXISTS category;
ALTER TABLE posts 
  ADD COLUMN category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  ADD COLUMN thumbnail_url TEXT,
  ADD COLUMN summary TEXT,
  ADD COLUMN status TEXT DEFAULT 'draft';

-- 3. Tạo bảng Contacts
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Cập nhật Comments
ALTER TABLE comments ADD COLUMN is_approved BOOLEAN DEFAULT false;

-- 5. Thiết lập RLS bổ sung
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "anyone can send contact" ON contacts FOR INSERT WITH CHECK (true);