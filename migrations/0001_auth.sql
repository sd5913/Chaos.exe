CREATE TABLE oauth_attempts (
  state TEXT PRIMARY KEY,
  browser_hash TEXT NOT NULL,
  verifier TEXT NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX oauth_attempts_expiry ON oauth_attempts(expires_at);

CREATE TABLE auth_sessions (
  token_hash TEXT PRIMARY KEY,
  github_id TEXT NOT NULL,
  login TEXT NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX auth_sessions_expiry ON auth_sessions(expires_at);
