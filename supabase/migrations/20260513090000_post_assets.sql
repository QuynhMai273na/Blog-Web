ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS content_json jsonb;

CREATE TABLE IF NOT EXISTS post_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('cover', 'inline')),
  storage_path text NOT NULL UNIQUE,
  public_url text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'attached')),
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS post_assets_post_id_idx ON post_assets(post_id);
CREATE INDEX IF NOT EXISTS post_assets_created_by_idx ON post_assets(created_by);
CREATE INDEX IF NOT EXISTS post_assets_status_idx ON post_assets(status);

ALTER TABLE post_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin manage post assets"
  ON post_assets FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.app_role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.app_role = 'admin'
    )
  );

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'post-media',
  'post-media',
  true,
  8388608,
  ARRAY['image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

CREATE POLICY "public read post media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'post-media');

CREATE POLICY "admin insert post media"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'post-media'
    AND EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.app_role = 'admin'
    )
  );

CREATE POLICY "admin update post media"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'post-media'
    AND EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.app_role = 'admin'
    )
  )
  WITH CHECK (
    bucket_id = 'post-media'
    AND EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.app_role = 'admin'
    )
  );

CREATE POLICY "admin delete post media"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'post-media'
    AND EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.app_role = 'admin'
    )
  );
