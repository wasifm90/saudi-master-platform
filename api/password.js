// server/vercel/routes/password.ts
import { compare, hash as hashPassword } from "bcryptjs";

// server/vercel/database.ts
import mysql from "mysql2/promise";
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
async function adminHash() {
  await ensureSchema();
  const [rows] = await database().execute("SELECT password_hash FROM cms_admin WHERE id = 1");
  return rows.length ? String(rows[0]["password_hash"]) : null;
}
async function changeAdminHash(current, replacement) {
  await ensureSchema();
  const [result] = await database().execute(
    "UPDATE cms_admin SET password_hash = ? WHERE id = 1 AND password_hash = ?",
    [replacement, current]
  );
  return "affectedRows" in result && Number(result.affectedRows) === 1;
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
function expiredSessionCookie(request) {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `${cookieName}=; Max-Age=0; HttpOnly; SameSite=Strict; Path=/${secure}`;
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

// server/vercel/routes/password.ts
async function POST(request) {
  if (!databaseConfigured()) return json({ error: "CMS database is not configured." }, 503);
  let currentHash;
  try {
    currentHash = await adminHash();
  } catch {
    return json({ error: "CMS database is unavailable." }, 503);
  }
  const error = mutationError(request, request.headers.get("x-csrf-token"), currentHash);
  if (error) return error;
  let body;
  try {
    body = await input(request, 4096);
  } catch {
    return json({ error: "Invalid request." }, 400);
  }
  if (!body || typeof body !== "object") return json({ error: "Invalid request." }, 400);
  const values = body;
  if (typeof values["currentPassword"] !== "string" || typeof values["newPassword"] !== "string" || values["newPassword"].length < 12 || values["newPassword"].length > 128) {
    return json({ error: "Use a new password between 12 and 128 characters." }, 422);
  }
  if (!currentHash || !await compare(values["currentPassword"], currentHash)) {
    return json({ error: "Current password is incorrect." }, 401);
  }
  try {
    const replacement = await hashPassword(values["newPassword"], 12);
    if (!await changeAdminHash(currentHash, replacement)) {
      return json({ error: "Password changed in another session. Sign in again." }, 409);
    }
    return json({ authenticated: false }, 200, { "Set-Cookie": expiredSessionCookie(request) });
  } catch (failure) {
    console.error("CMS password update:", failure);
    return json({ error: "Could not update password." }, 503);
  }
}
export {
  POST
};
