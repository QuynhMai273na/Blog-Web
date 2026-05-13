-- Seed content for Becoming Blooming.
-- Safe to run more than once.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS app_role TEXT NOT NULL DEFAULT 'user'
  CHECK (app_role IN ('user', 'author', 'admin'));

ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS content_json jsonb;

CREATE OR REPLACE FUNCTION public.seed_tiptap_from_markdown(p_content text)
RETURNS jsonb
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  v_block text;
  v_trimmed text;
  v_nodes jsonb := '[]'::jsonb;
  v_type text;
  v_level int;
  v_text text;
BEGIN
  FOREACH v_block IN ARRAY regexp_split_to_array(coalesce(p_content, ''), E'\n[ \t\r\n]*\n')
  LOOP
    v_trimmed := btrim(v_block);
    IF v_trimmed = '' THEN
      CONTINUE;
    END IF;

    IF v_trimmed LIKE '### %' THEN
      v_type := 'heading';
      v_level := 3;
      v_text := btrim(substr(v_trimmed, 5));
    ELSIF v_trimmed LIKE '## %' THEN
      v_type := 'heading';
      v_level := 2;
      v_text := btrim(substr(v_trimmed, 4));
    ELSIF v_trimmed LIKE '> %' THEN
      v_type := 'blockquote';
      v_level := NULL;
      v_text := btrim(substr(v_trimmed, 3));
    ELSE
      v_type := 'paragraph';
      v_level := NULL;
      v_text := v_trimmed;
    END IF;

    IF v_type = 'heading' THEN
      v_nodes := v_nodes || jsonb_build_array(
        jsonb_build_object(
          'type', 'heading',
          'attrs', jsonb_build_object('level', v_level),
          'content', jsonb_build_array(jsonb_build_object('type', 'text', 'text', v_text))
        )
      );
    ELSIF v_type = 'blockquote' THEN
      v_nodes := v_nodes || jsonb_build_array(
        jsonb_build_object(
          'type', 'blockquote',
          'content', jsonb_build_array(
            jsonb_build_object(
              'type', 'paragraph',
              'content', jsonb_build_array(jsonb_build_object('type', 'text', 'text', v_text))
            )
          )
        )
      );
    ELSE
      v_nodes := v_nodes || jsonb_build_array(
        jsonb_build_object(
          'type', 'paragraph',
          'content', jsonb_build_array(jsonb_build_object('type', 'text', 'text', v_text))
        )
      );
    END IF;
  END LOOP;

  RETURN jsonb_build_object('type', 'doc', 'content', v_nodes);
END;
$$;

INSERT INTO categories (id, name, slug, description)
VALUES
  ('11111111-1111-4111-8111-111111111111', 'Parenting', 'parenting', 'Nhung ghi chep ve lam me, cham soc con va giu ket noi trong gia dinh.'),
  ('22222222-2222-4222-8222-222222222222', 'Yoga & Suc khoe', 'yoga', 'Thoi quen song cham, van dong nhe va cham soc suc khoe moi ngay.'),
  ('33333333-3333-4333-8333-333333333333', 'Tai chinh', 'finance', 'Quan ly tien bac ca nhan theo cach ro rang, nhe nhang va ben vung.'),
  ('44444444-4444-4444-8444-444444444444', 'Cuoc song', 'life', 'Bai hoc nho tu nhung ngay binh thuong.')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

INSERT INTO posts (
  id,
  title,
  slug,
  content,
  content_json,
  category_id,
  thumbnail_url,
  summary,
  status,
  published_at
)
SELECT
  id,
  title,
  slug,
  content,
  public.seed_tiptap_from_markdown(content),
  category_id,
  thumbnail_url,
  summary,
  status,
  published_at
FROM (
VALUES
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    '5 dong tac yoga giup me bau ngu ngon hon moi toi',
    'yoga-me-bau-ngu-ngon',
    'Khi mang thai, giac ngu tro thanh thu xa xi ma minh chua tung nghi minh se thieu den vay. Bung ngay cang lon, lung ngay cang moi, va co nhung dem minh chi mong tim duoc mot tu the du diu de co the bot cang hon mot chut.

## 1. Tu the con meo - con bo
Tu the nay giup thu gian co lung duoi va cai thien tuan hoan. Hay thuc hien cham, hit tho deu theo tung chuyen dong, khoang 8 den 10 lan moi toi.

## 2. Tu the tre em voi goi do
Mo rong hai dau goi de nhuong cho bung bau. Day la tu the minh yeu thich vi cam giac duoc tha long toan than ro rang va de chiu.

## 3. Ngoi gap nguoi nhe
Neu lung duoi moi nhieu, mot chiec goi mong o phan hong se giup do luc kha tot. Minh thuong giu tu the nay vai nhip tho sau truoc khi len giuong.',
    '22222222-2222-4222-8222-222222222222',
    null,
    'Nhung tu the nhe nhang phu hop cho tam ca nguyet thu ba, giup co the tha long va giac ngu den de hon.',
    'published',
    '2026-04-15 08:00:00+00'
  ),
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2',
    'Cach minh tiet kiem 30% thu nhap ma khong cam thay thieu thon',
    'tiet-kiem-30-phan-tram',
    'Co mot giai doan minh nghi tiet kiem dong nghia voi cat bo niem vui. Nhung sau vai nam thu nghiem, minh nhan ra van de khong nam o viec chi it hon, ma la chi ro rang hon.

## 1. Tach tien truoc khi tieu
Minh chuyen ngay mot phan thu nhap sang tai khoan rieng vao ngay nhan luong de khong roi vao cam giac con bao nhieu thi tieu bay nhieu.

## 2. Giu vai hang muc that quan trong
Khi moi thu deu la uu tien, khong gi con la uu tien. Minh chi giu lai nhung nhom chi anh huong toi suc khoe, gia dinh va cong viec.

## 3. Tao quy cho niem vui
Tiet kiem ben vung van can co cho cho nhung dieu lam minh vui. Dieu quan trong la minh biet truoc gioi han cua no.',
    '33333333-3333-4333-8333-333333333333',
    null,
    'Mot vai nguyen tac nho nhung ben vung giup viec tiet kiem khong con la cam giac tu ep ban than.',
    'published',
    '2026-04-10 08:00:00+00'
  ),
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3',
    'Khi con khoc ma minh khong hieu tai sao',
    'khi-con-khoc',
    'Co nhung ngay con khoc rat lau va minh chi muon khoc theo. Lam me khien minh nhan ra su bat luc cung la mot phan cua yeu thuong.

## 1. Binh tinh lai truoc khi tim cau tra loi
Khi minh hoang, con cang cang hon. Dieu dau tien minh hoc la hit tho cham vai nhip de co the lang xuong truoc.

## 2. Ghi lai nhung dau hieu nho
Gio ngu, cu bu, nhiet do phong, am thanh xung quanh... nhung chi tiet nho nay giup minh dan hieu con hon theo thoi gian.

## 3. Nho rang minh khong can hoan hao
Khong phai luc nao hieu ngay con cung la yeu con du. Co khi yeu la van o do, du minh chua biet phai lam gi.',
    '11111111-1111-4111-8111-111111111111',
    null,
    'Hanh trinh hoc cach lang nghe, cham lai va bot tu trach minh trong nhung ngay lam me boi roi.',
    'published',
    '2026-04-05 08:00:00+00'
  ),
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa4',
    'Nhat ky 30 ngay uong du nuoc - dieu gi da thay doi?',
    'uong-du-nuoc-30-ngay',
    'Minh luon nghi uong nuoc la chuyen ai cung biet. Nhung biet khong dong nghia voi viec lam deu. 30 ngay vua roi la luc minh thu nghiem tuc voi thoi quen don gian nay.

## 1. Da bot kho va co the do met giua chieu
Dieu minh nhan ra som nhat la cam giac hut nang luong luc 3 gio chieu giam di dang ke, nhat la vao nhung ngay lam viec lien tuc.

## 2. Uong nuoc de hon khi co nhip co dinh
Minh khong co uong that nhieu, chi chia thanh cac moc nho trong ngay. Cach nay nhe nhang hon va thuc te hon nhieu.

## 3. Chuan bi san la mot nua thanh cong
Mot binh nuoc o ban lam viec giup minh bot quen va bot can co gang.',
    '22222222-2222-4222-8222-222222222222',
    null,
    'Mot thoi quen rat nho nhung tac dong den nang luong, lan da va cam giac tinh tao trong ngay.',
    'published',
    '2026-04-01 08:00:00+00'
  ),
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa5',
    'Cach giu thoi quen tap yoga khi ban con nho',
    'giu-thoi-quen-yoga-khi-ban-con',
    'Sau khi co con, viec danh tron mot tieng cho yoga gan nhu bien mat khoi lich cua minh. Nhung minh hoc duoc rang thoi quen khong can dai, chi can con hien dien.

## 1. Giam ky vong de giu nhip
Minh khong con dat muc tieu phai tap du bai. Co hom chi la 10 phut vuon vai, nhung nho vay minh khong bo han.

## 2. Chon thoi diem it can tro nhat
Sang som truoc khi con day hoac buoi toi sau khi moi thu yen hon la hai khoang thoi gian minh thay thuc te nhat.

## 3. De tham tap o noi de thay
Mot thay doi nho trong khong gian giup minh nho den viec cham soc co the moi ngay.',
    '11111111-1111-4111-8111-111111111111',
    null,
    'Khong can mot buoi tap hoan hao, chi can mot nhip deu du that de co the con nho cach duoc cham soc.',
    'published',
    '2026-03-28 08:00:00+00'
  ),
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa6',
    'Bai hoc minh hoc duoc tu viec that bai nhieu lan',
    'bai-hoc-tu-that-bai',
    'Co nhung lan that bai lam minh muon dung lai rat lau. Nhung khi nhin ky hon, moi lan nhu vay deu de lai mot dau moi ve dieu minh can hoc tiep.

## 1. That bai cho thay dieu minh dang tranh ne
Nhung viec minh tri hoan thuong la viec minh can doi dien nhat. Khi goi ten duoc no, moi thu bot mo ho hon.

## 2. Nghi ngoi khong phai bo cuoc
Co luc cach tot nhat de tiep tuc la dung lai mot nhip, ngu mot giac, roi quay lai voi tam tri ro rang hon.

## 3. Chon mot viec nho de bat dau lai
Sau moi lan vap, minh chi chon mot hanh dong nho trong ngay. Nho nhung lam duoc se tao lai niem tin.',
    '44444444-4444-4444-8444-444444444444',
    null,
    'Khong phai moi thu deu suon se, va doi khi nhung vap nga lai la co hoi tot de hieu minh hon.',
    'published',
    '2026-03-20 08:00:00+00'
  )
) AS seed_posts (
  id,
  title,
  slug,
  content,
  category_id,
  thumbnail_url,
  summary,
  status,
  published_at
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  content_json = EXCLUDED.content_json,
  category_id = EXCLUDED.category_id,
  thumbnail_url = EXCLUDED.thumbnail_url,
  summary = EXCLUDED.summary,
  status = EXCLUDED.status,
  published_at = EXCLUDED.published_at;

-- Demo users for local development and comment seed.
-- Password for all demo accounts: Password123!
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
VALUES
  (
    'aaaaaaaa-0000-4000-8000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'linh.demo@example.com',
    crypt('Password123!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Linh Nguyen","name":"Linh Nguyen"}'::jsonb,
    now(),
    now()
  ),
  (
    'aaaaaaaa-0000-4000-8000-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'chau.demo@example.com',
    crypt('Password123!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Chau Tran","name":"Chau Tran"}'::jsonb,
    now(),
    now()
  )
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  encrypted_password = EXCLUDED.encrypted_password,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  updated_at = now();

INSERT INTO auth.identities (
  id,
  user_id,
  provider_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
VALUES
  (
    'aaaaaaaa-0000-4000-8000-000000000001',
    'aaaaaaaa-0000-4000-8000-000000000001',
    'linh.demo@example.com',
    '{"sub":"aaaaaaaa-0000-4000-8000-000000000001","email":"linh.demo@example.com"}'::jsonb,
    'email',
    now(),
    now(),
    now()
  ),
  (
    'aaaaaaaa-0000-4000-8000-000000000002',
    'aaaaaaaa-0000-4000-8000-000000000002',
    'chau.demo@example.com',
    '{"sub":"aaaaaaaa-0000-4000-8000-000000000002","email":"chau.demo@example.com"}'::jsonb,
    'email',
    now(),
    now(),
    now()
  )
ON CONFLICT (provider, provider_id) DO UPDATE SET
  identity_data = EXCLUDED.identity_data,
  updated_at = now();

INSERT INTO profiles (id, email, display_name, avatar_url, auth_provider, app_role)
VALUES
  ('aaaaaaaa-0000-4000-8000-000000000001', 'linh.demo@example.com', 'Linh Nguyen', null, 'email', 'author'),
  ('aaaaaaaa-0000-4000-8000-000000000002', 'chau.demo@example.com', 'Chau Tran', null, 'email', 'user')
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  display_name = EXCLUDED.display_name,
  avatar_url = EXCLUDED.avatar_url,
  auth_provider = EXCLUDED.auth_provider,
  app_role = EXCLUDED.app_role;

INSERT INTO comments (id, post_id, user_id, body, is_approved, created_at)
VALUES
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbb001', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'aaaaaaaa-0000-4000-8000-000000000001', 'Minh thu tu the so 2 va ngu ngon hon han tu tuan truoc. Cam on bai viet rat nhieu.', true, '2026-04-16 08:00:00+00'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbb002', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'aaaaaaaa-0000-4000-8000-000000000002', 'Bai viet rat huu ich. Minh sap vao tam ca nguyet 3 roi, se thu ngay toi nay.', true, '2026-04-16 09:00:00+00'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbb003', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', 'aaaaaaaa-0000-4000-8000-000000000002', 'Doc xong thay viec tiet kiem bot dang so hon nhieu. Phan chi ro rang hon rat dung.', true, '2026-04-11 08:00:00+00'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbb004', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3', 'aaaaaaaa-0000-4000-8000-000000000001', 'Doc ma thay duoc an ui. Co nhung hom minh cung chi biet om con va cho moi thu diu xuong.', true, '2026-04-06 08:00:00+00')
ON CONFLICT (id) DO UPDATE SET
  body = EXCLUDED.body,
  is_approved = EXCLUDED.is_approved,
  created_at = EXCLUDED.created_at;

INSERT INTO subscribers (email, confirmed)
VALUES
  ('reader.one@example.com', true),
  ('reader.two@example.com', false)
ON CONFLICT (email) DO UPDATE SET confirmed = EXCLUDED.confirmed;
