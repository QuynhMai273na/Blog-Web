ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS notify_subscribers_on_publish BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS subscriber_notified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS subscriber_notification_error TEXT;

CREATE INDEX IF NOT EXISTS posts_scheduled_notification_idx
  ON posts (status, published_at, notify_subscribers_on_publish, subscriber_notified_at);
