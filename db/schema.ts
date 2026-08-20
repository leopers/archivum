export const createCommentsTable = `
  CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    content_key TEXT NOT NULL,
    locale TEXT NOT NULL,
    author_name TEXT NOT NULL,
    body TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending'
      CHECK (status IN ('pending', 'approved', 'rejected')),
    ip_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TEXT
  )
`;

export const createPublishedCommentsIndex = `
  CREATE INDEX IF NOT EXISTS idx_comments_content_locale_status_created
  ON comments (content_key, locale, status, created_at)
`;

export const createRateLimitIndex = `
  CREATE INDEX IF NOT EXISTS idx_comments_ip_created
  ON comments (ip_hash, created_at)
`;

export const createCommentLanguagesTable = `
  CREATE TABLE IF NOT EXISTS comment_languages (
    comment_id TEXT PRIMARY KEY,
    detected_locale TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE
  )
`;

export const createCommentTranslationsTable = `
  CREATE TABLE IF NOT EXISTS comment_translations (
    comment_id TEXT NOT NULL,
    target_locale TEXT NOT NULL,
    translated_body TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (comment_id, target_locale),
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE
  )
`;
