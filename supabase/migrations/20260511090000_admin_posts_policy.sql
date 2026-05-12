CREATE POLICY "admin insert posts"
  ON posts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.app_role = 'admin'
    )
  );

CREATE POLICY "admin update posts"
  ON posts FOR UPDATE
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

CREATE POLICY "admin delete posts"
  ON posts FOR DELETE
  USING (
    EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.app_role = 'admin'
    )
  );

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'post-covers',
  'post-covers',
  true,
  5242880,
  ARRAY['image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

CREATE POLICY "public read post covers"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'post-covers');

CREATE POLICY "admin insert post covers"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'post-covers'
    AND EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.app_role = 'admin'
    )
  );

CREATE POLICY "admin update post covers"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'post-covers'
    AND EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.app_role = 'admin'
    )
  )
  WITH CHECK (
    bucket_id = 'post-covers'
    AND EXISTS (
      SELECT 1
      FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.app_role = 'admin'
    )
  );
