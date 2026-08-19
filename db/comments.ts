import { env } from "cloudflare:workers";
import {
  createCommentsTable,
  createPublishedCommentsIndex,
  createRateLimitIndex,
} from "./schema";

type D1Result<T> = { results?: T[] };
type Statement = {
  bind: (...values: unknown[]) => Statement;
  first: <T = unknown>() => Promise<T | null>;
  all: <T = unknown>() => Promise<D1Result<T>>;
  run: () => Promise<unknown>;
};
type Database = {
  prepare: (query: string) => Statement;
  batch: (statements: Statement[]) => Promise<unknown>;
};

export type CommentRecord = {
  id: string;
  content_key: string;
  locale: string;
  author_name: string;
  body: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

export function getCommentsDb() {
  const db = (env as unknown as { DB?: Database }).DB;
  if (!db) throw new Error("Comments database is unavailable.");
  return db;
}

export async function ensureCommentsSchema(db = getCommentsDb()) {
  await db.batch([
    db.prepare(createCommentsTable),
    db.prepare(createPublishedCommentsIndex),
    db.prepare(createRateLimitIndex),
  ]);
}

export async function hashVisitor(value: string) {
  const bytes = new TextEncoder().encode(`archivum-comments:${value}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function isAdminToken(token: string | null) {
  const configured = (env as unknown as { COMMENTS_ADMIN_TOKEN?: string })
    .COMMENTS_ADMIN_TOKEN;
  return Boolean(configured && token && configured === token);
}
