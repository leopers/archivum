import type { APIRoute } from "astro";
import {
  ensureCommentsSchema,
  getCommentsDb,
  hashVisitor,
  isAdminToken,
  type CommentRecord,
} from "../../../db/comments";

export const prerender = false;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });

const validContentKey = (value: string) =>
  /^(writing|projects)\/[a-z0-9][a-z0-9-]{1,100}$/.test(value);
const validLocale = (value: string) => ["en", "fr", "pt-br"].includes(value);

export const GET: APIRoute = async ({ request, url }) => {
  try {
    const db = getCommentsDb();
    await ensureCommentsSchema(db);
    const admin = isAdminToken(request.headers.get("x-admin-token"));

    const moderation = url.searchParams.get("moderation");
    if (
      admin &&
      ["pending", "approved", "rejected"].includes(moderation ?? "")
    ) {
      const rows = await db
        .prepare(
          `SELECT id, content_key, locale, author_name, body, status, created_at
           FROM comments WHERE status = ?
           ORDER BY created_at ASC LIMIT 100`,
        )
        .bind(moderation)
        .all<CommentRecord>();
      return json({ comments: rows.results ?? [] });
    }

    const contentKey = url.searchParams.get("content") ?? "";
    const locale = url.searchParams.get("locale") ?? "en";
    if (!validContentKey(contentKey) || !validLocale(locale))
      return json({ error: "Invalid article or language." }, 400);

    const rows = await db
      .prepare(
        `SELECT id, author_name, body, created_at
         FROM comments
         WHERE content_key = ? AND locale = ? AND status = 'approved'
         ORDER BY created_at ASC LIMIT 100`,
      )
      .bind(contentKey, locale)
      .all<CommentRecord>();
    return json({ comments: rows.results ?? [] });
  } catch (error) {
    console.error("comments:get", error);
    return json({ error: "Comments are temporarily unavailable." }, 500);
  }
};

export const POST: APIRoute = async ({ request, url }) => {
  try {
    const origin = request.headers.get("origin");
    if (!origin || origin !== url.origin)
      return json({ error: "Invalid request origin." }, 403);

    const payload = (await request.json()) as Record<string, unknown>;
    const contentKey = String(payload.contentKey ?? "").trim();
    const locale = String(payload.locale ?? "en").trim();
    const authorName = String(payload.authorName ?? "").trim();
    const body = String(payload.body ?? "").trim();
    const website = String(payload.website ?? "").trim();

    if (website) return json({ ok: true, pending: true }, 201);
    if (!validContentKey(contentKey) || !validLocale(locale))
      return json({ error: "Invalid article or language." }, 400);
    if (authorName.length < 2 || authorName.length > 60)
      return json(
        { error: "Please use a name between 2 and 60 characters." },
        400,
      );
    if (body.length < 10 || body.length > 2000)
      return json(
        { error: "Comments must contain between 10 and 2000 characters." },
        400,
      );

    const db = getCommentsDb();
    await ensureCommentsSchema(db);
    const visitor =
      request.headers.get("cf-connecting-ip") ??
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    const ipHash = await hashVisitor(visitor);
    const recent = await db
      .prepare(
        `SELECT COUNT(*) AS count FROM comments
         WHERE ip_hash = ? AND created_at >= datetime('now', '-10 minutes')`,
      )
      .bind(ipHash)
      .first<{ count: number }>();
    if ((recent?.count ?? 0) >= 3)
      return json(
        { error: "Please wait before sending another comment." },
        429,
      );

    await db
      .prepare(
        `INSERT INTO comments
         (id, content_key, locale, author_name, body, status, ip_hash)
         VALUES (?, ?, ?, ?, ?, 'pending', ?)`,
      )
      .bind(crypto.randomUUID(), contentKey, locale, authorName, body, ipHash)
      .run();
    return json({ ok: true, pending: true }, 201);
  } catch (error) {
    console.error("comments:post", error);
    return json({ error: "Your comment could not be sent." }, 500);
  }
};

export const PATCH: APIRoute = async ({ request }) => {
  try {
    if (!isAdminToken(request.headers.get("x-admin-token")))
      return json({ error: "Unauthorized." }, 401);
    const payload = (await request.json()) as Record<string, unknown>;
    const id = String(payload.id ?? "");
    const status = String(payload.status ?? "");
    if (!id || !["approved", "rejected"].includes(status))
      return json({ error: "Invalid moderation action." }, 400);
    const db = getCommentsDb();
    await ensureCommentsSchema(db);
    await db
      .prepare(
        `UPDATE comments SET status = ?, reviewed_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
      )
      .bind(status, id)
      .run();
    return json({ ok: true });
  } catch (error) {
    console.error("comments:patch", error);
    return json({ error: "The moderation action failed." }, 500);
  }
};

export const DELETE: APIRoute = async ({ request }) => {
  try {
    if (!isAdminToken(request.headers.get("x-admin-token")))
      return json({ error: "Unauthorized." }, 401);
    const payload = (await request.json()) as Record<string, unknown>;
    const id = String(payload.id ?? "").trim();
    if (!id) return json({ error: "A comment id is required." }, 400);

    const db = getCommentsDb();
    await ensureCommentsSchema(db);
    await db.prepare("DELETE FROM comments WHERE id = ?").bind(id).run();
    return json({ ok: true });
  } catch (error) {
    console.error("comments:delete", error);
    return json({ error: "The comment could not be deleted." }, 500);
  }
};
