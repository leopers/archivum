CREATE TABLE IF NOT EXISTS comment_languages (
  comment_id TEXT PRIMARY KEY,
  detected_locale TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comment_translations (
  comment_id TEXT NOT NULL,
  target_locale TEXT NOT NULL,
  translated_body TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (comment_id, target_locale),
  FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE
);

PRAGMA optimize;
