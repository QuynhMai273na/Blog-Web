ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS allow_comments BOOLEAN NOT NULL DEFAULT true;

DROP POLICY IF EXISTS "login to comment" ON comments;

CREATE POLICY "login to comment"
  ON comments FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1
      FROM posts
      WHERE posts.id = post_id
        AND posts.allow_comments = true
    )
  );
