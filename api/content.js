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
async function readContent() {
  await ensureSchema();
  const [rows] = await database().execute("SELECT revision, document FROM cms_document WHERE id = 1");
  if (!rows.length) return { revision: 0, content: null };
  return { revision: Number(rows[0]["revision"]), content: JSON.parse(String(rows[0]["document"])) };
}
async function publishContent(revision, content) {
  await ensureSchema();
  const connection = await database().getConnection();
  try {
    await connection.beginTransaction();
    const [rows] = await connection.execute("SELECT revision FROM cms_document WHERE id = 1 FOR UPDATE");
    const current = rows.length ? Number(rows[0]["revision"]) : 0;
    if (current !== revision) {
      await connection.rollback();
      return { conflict: current };
    }
    const next = current + 1;
    const encoded = JSON.stringify(content);
    if (rows.length) {
      await connection.execute("UPDATE cms_document SET revision = ?, document = ? WHERE id = 1", [next, encoded]);
    } else {
      await connection.execute("INSERT INTO cms_document (id, revision, document) VALUES (1, ?, ?)", [next, encoded]);
    }
    await connection.commit();
    return { revision: next, content };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
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
function validDocument(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const document = value;
  const collections = ["products", "geometries", "assembly", "projects", "services", "processes", "industries", "articles", "jobs", "navigation"];
  const sections = ["company", "home", "pages", "collectionCopy", "media", "labels", "visibility"];
  if (!collections.every((key) => Array.isArray(document[key]))) return false;
  if (!sections.every((key) => document[key] && typeof document[key] === "object" && !Array.isArray(document[key]))) return false;
  const slugs = /* @__PURE__ */ new Set();
  for (const item of document["products"]) {
    if (!item || typeof item !== "object") return false;
    const product = item;
    if (typeof product["slug"] !== "string" || !/^[a-z0-9-]+$/.test(product["slug"]) || typeof product["name"] !== "string" || !product["name"].trim() || typeof product["featuredImage"] !== "string" || !product["featuredImage"].trim() || slugs.has(product["slug"])) return false;
    slugs.add(product["slug"]);
  }
  return true;
}

// server/vercel/routes/content.ts
async function GET() {
  if (!databaseConfigured()) return json({ revision: 0, content: null });
  try {
    return json(await readContent());
  } catch (error) {
    console.error("CMS content read:", error);
    return json({ error: "Published content is temporarily unavailable." }, 503);
  }
}
async function PUT(request) {
  if (!databaseConfigured()) return json({ error: "CMS database is not configured." }, 503);
  let hash;
  try {
    hash = await adminHash();
  } catch {
    return json({ error: "CMS database is unavailable." }, 503);
  }
  const error = mutationError(request, request.headers.get("x-csrf-token"), hash);
  if (error) return error;
  let body;
  try {
    body = await input(request);
  } catch {
    return json({ error: "Invalid JSON or content is too large." }, 400);
  }
  if (!body || typeof body !== "object") return json({ error: "Invalid content document." }, 422);
  const supplied = body;
  if (!Number.isSafeInteger(supplied["revision"]) || Number(supplied["revision"]) < 0 || !validDocument(supplied["content"])) return json({ error: "Invalid content document." }, 422);
  try {
    const result = await publishContent(Number(supplied["revision"]), supplied["content"]);
    if ("conflict" in result) return json({ error: "Content changed in another session. Reload before saving.", revision: result.conflict }, 409);
    return json(result);
  } catch (error2) {
    console.error("CMS content write:", error2);
    return json({ error: "Could not save content." }, 503);
  }
}
export {
  GET,
  PUT
};
