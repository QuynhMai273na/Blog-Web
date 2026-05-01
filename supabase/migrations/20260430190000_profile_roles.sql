ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS app_role TEXT NOT NULL DEFAULT 'user'
  CHECK (app_role IN ('user', 'author', 'admin'));

CREATE INDEX IF NOT EXISTS profiles_app_role_idx ON profiles(app_role);
