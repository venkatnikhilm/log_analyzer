-- init.sql: runs once when Postgres first initializes the DB

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  email       VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  salt        VARCHAR(32) NOT NULL,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Files table: each upload
CREATE TABLE IF NOT EXISTS files (
  file_hash   VARCHAR(255) PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_name   TEXT NOT NULL,
  file_size   BIGINT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Log entries: one row per log line
CREATE TABLE IF NOT EXISTS log_entries (
  id          SERIAL PRIMARY KEY,
  file_hash   VARCHAR(255) NOT NULL REFERENCES files(file_hash) ON DELETE CASCADE,
  timestamp   TIMESTAMP WITH TIME ZONE NOT NULL,
  ip          TEXT,
  method      TEXT,
  uri         TEXT,
  status      INTEGER,
  bytes       BIGINT,
  user_agent  TEXT,
  referer     TEXT
);

-- AI insights: stored JSON per file
CREATE TABLE IF NOT EXISTS ai_insights (
  id          SERIAL PRIMARY KEY,
  file_hash   VARCHAR(255) UNIQUE NOT NULL REFERENCES files(file_hash) ON DELETE CASCADE,
  insights    JSONB NOT NULL,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT now()
);