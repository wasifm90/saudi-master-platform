// server/vercel/routes/upload.ts
import { handleUpload } from "@vercel/blob/client";

// server/vercel/database.ts
import mysql from "mysql2/promise";
import { createHash } from "node:crypto";
var pool;
var ready;
function databaseConfigured() {
  return Boolean((process.env["CMS_DB_HOST"] || process.env["TIDB_HOST"]) && (process.env["CMS_DB_NAME"] || process.env["TIDB_DATABASE"]) && (process.env["CMS_DB_USER"] || process.env["TIDB_USER"]) && (process.env["CMS_DB_PASSWORD"] || process.env["TIDB_PASSWORD"]));
}
function database() {
  if (!databaseConfigured()) throw new Error("CMS database is not configured.");
  if (!pool) {
    pool = mysql.createPool({
      host: process.env["CMS_DB_HOST"] || process.env["TIDB_HOST"],
      port: Number(process.env["CMS_DB_PORT"] || process.env["TIDB_PORT"] || 3306),
      database: process.env["CMS_DB_NAME"] || process.env["TIDB_DATABASE"],
      user: process.env["CMS_DB_USER"] || process.env["TIDB_USER"],
      password: process.env["CMS_DB_PASSWORD"] || process.env["TIDB_PASSWORD"],
      waitForConnections: true,
      connectionLimit: 3,
      maxIdle: 1,
      idleTimeout: 6e4,
      enableKeepAlive: true,
      ssl: process.env["CMS_DB_SSL"] === "true" || Boolean(process.env["TIDB_HOST"]) ? {
        rejectUnauthorized: true,
        ...process.env["CMS_DB_SSL_CA"] ? { ca: process.env["CMS_DB_SSL_CA"] } : {}
      } : void 0
    });
  }
  return pool;
}
async function ensureSchema() {
  if (!ready) {
    ready = (async () => {
      const db = database();
      await db.execute(`CREATE TABLE IF NOT EXISTS cms_admin (
        id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
        password_hash VARCHAR(255) NOT NULL,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
      await db.execute(`CREATE TABLE IF NOT EXISTS cms_document (
        id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
        revision INT UNSIGNED NOT NULL,
        document LONGTEXT NOT NULL,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
      await db.execute(`CREATE TABLE IF NOT EXISTS cms_media (
        url_hash CHAR(64) NOT NULL PRIMARY KEY,
        url TEXT NOT NULL,
        pathname VARCHAR(500) NOT NULL,
        content_type VARCHAR(100) NOT NULL,
        uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
      const seed = process.env["CMS_ADMIN_BOOTSTRAP_HASH"];
      if (seed && /^\$2[aby]\$\d\d\$/.test(seed)) {
        await db.execute("INSERT IGNORE INTO cms_admin (id, password_hash) VALUES (1, ?)", [seed]);
      }
    })().catch((error) => {
      ready = void 0;
      throw error;
    });
  }
  await ready;
}
async function recordMedia(url, pathname, contentType) {
  await ensureSchema();
  await database().execute(
    "INSERT IGNORE INTO cms_media (url_hash, url, pathname, content_type) VALUES (?, ?, ?, ?)",
    [createHash("sha256").update(url).digest("hex"), url, pathname, contentType]
  );
}
async function adminHash() {
  await ensureSchema();
  const [rows] = await database().execute("SELECT password_hash FROM cms_admin WHERE id = 1");
  return rows.length ? String(rows[0]["password_hash"]) : null;
}

// server/vercel/shared.ts
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
var cookieName = "sm_cms";
var lifetimeSeconds = 12 * 60 * 60;
function json(body, status = 200, headers = {}) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...headers
    }
  });
}
function signature(payload, hash) {
  return createHmac("sha256", hash).update(`saudi-master-cms-session-v1:${payload}`).digest("base64url");
}
function session(request, hash) {
  if (!hash) return null;
  const token = request.headers.get("cookie")?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1);
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const expected = Buffer.from(signature(parts[0], hash));
  const received = Buffer.from(parts[1]);
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;
  try {
    const parsed = JSON.parse(Buffer.from(parts[0], "base64url").toString());
    return Number.isFinite(parsed.expires) && parsed.expires > Date.now() && typeof parsed.csrf === "string" && parsed.csrf.length >= 32 ? parsed : null;
  } catch {
    return null;
  }
}
function mutationError(request, csrf, hash) {
  const active = session(request, hash);
  if (!active) return json({ error: "Sign in required." }, 401);
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return json({ error: "Invalid origin." }, 403);
  if (!csrf || csrf !== active.csrf) return json({ error: "Session check failed. Refresh and sign in again." }, 403);
  return null;
}
async function input(request, maxBytes = 4e6) {
  if (Number(request.headers.get("content-length")) > maxBytes) throw new Error("Request is too large.");
  const raw = await request.text();
  if (Buffer.byteLength(raw) > maxBytes) throw new Error("Request is too large.");
  return JSON.parse(raw);
}

// server/vercel/routes/upload.ts
var allowed = ["image/jpeg", "image/png", "image/webp", "image/avif", "video/mp4", "video/webm"];
async function POST(request) {
  if (!databaseConfigured() || !process.env["BLOB_READ_WRITE_TOKEN"]) {
    return json({ error: "CMS database or media storage is not configured." }, 503);
  }
  let body;
  try {
    body = await input(request, 64e3);
  } catch {
    return json({ error: "Invalid upload request." }, 400);
  }
  try {
    const hash = await adminHash();
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const error = mutationError(request, clientPayload, hash);
        if (error) throw new Error("Sign in required to upload.");
        if (!/^cms\/media\/[a-zA-Z0-9._-]+$/.test(pathname)) throw new Error("Invalid upload path.");
        return { allowedContentTypes: allowed, maximumSizeInBytes: 5e7, addRandomSuffix: true };
      },
      onUploadCompleted: async ({ blob }) => {
        await recordMedia(blob.url, blob.pathname, blob.contentType);
      }
    });
    return json(result);
  } catch (error) {
    console.error("CMS upload:", error);
    return json({ error: error instanceof Error ? error.message : "Upload failed." }, 400);
  }
}
export {
  POST
};
