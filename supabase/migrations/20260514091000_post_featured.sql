ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS featured_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS posts_featured_order_idx
  ON posts (is_featured DESC, featured_at DESC, published_at DESC);
