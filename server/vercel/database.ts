import mysql, { type Pool, type RowDataPacket } from 'mysql2/promise';
import { createHash } from 'node:crypto';

let pool: Pool | undefined;
let ready: Promise<void> | undefined;

export function databaseConfigured(): boolean {
  return Boolean((process.env['CMS_DB_HOST'] || process.env['TIDB_HOST']) &&
    (process.env['CMS_DB_NAME'] || process.env['TIDB_DATABASE']) &&
    (process.env['CMS_DB_USER'] || process.env['TIDB_USER']) &&
    (process.env['CMS_DB_PASSWORD'] || process.env['TIDB_PASSWORD']));
}

export function database(): Pool {
  if (!databaseConfigured()) throw new Error('CMS database is not configured.');
  if (!pool) {
    pool = mysql.createPool({
      host: process.env['CMS_DB_HOST'] || process.env['TIDB_HOST'],
      port: Number(process.env['CMS_DB_PORT'] || process.env['TIDB_PORT'] || 3306),
      database: process.env['CMS_DB_NAME'] || process.env['TIDB_DATABASE'],
      user: process.env['CMS_DB_USER'] || process.env['TIDB_USER'],
      password: process.env['CMS_DB_PASSWORD'] || process.env['TIDB_PASSWORD'],
      waitForConnections: true,
      connectionLimit: 3,
      maxIdle: 1,
      idleTimeout: 60_000,
      enableKeepAlive: true,
      ssl: process.env['CMS_DB_SSL'] === 'true' || Boolean(process.env['TIDB_HOST']) ? {
        rejectUnauthorized: true,
        ...(process.env['CMS_DB_SSL_CA'] ? { ca: process.env['CMS_DB_SSL_CA'] } : {}),
      } : undefined,
    });
  }
  return pool;
}

export async function ensureSchema(): Promise<void> {
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
      const seed = process.env['CMS_ADMIN_BOOTSTRAP_HASH'];
      if (seed && /^\$2[aby]\$\d\d\$/.test(seed)) {
        await db.execute('INSERT IGNORE INTO cms_admin (id, password_hash) VALUES (1, ?)', [seed]);
      }
    })().catch((error: unknown) => {
      ready = undefined;
      throw error;
    });
  }
  await ready;
}

export async function recordMedia(url: string, pathname: string, contentType: string): Promise<void> {
  await ensureSchema();
  await database().execute(
    'INSERT IGNORE INTO cms_media (url_hash, url, pathname, content_type) VALUES (?, ?, ?, ?)',
    [createHash('sha256').update(url).digest('hex'), url, pathname, contentType],
  );
}

export async function adminHash(): Promise<string | null> {
  await ensureSchema();
  const [rows] = await database().execute<RowDataPacket[]>('SELECT password_hash FROM cms_admin WHERE id = 1');
  return rows.length ? String(rows[0]['password_hash']) : null;
}

export async function changeAdminHash(current: string, replacement: string): Promise<boolean> {
  await ensureSchema();
  const [result] = await database().execute(
    'UPDATE cms_admin SET password_hash = ? WHERE id = 1 AND password_hash = ?',
    [replacement, current],
  );
  return 'affectedRows' in result && Number(result.affectedRows) === 1;
}

export async function readContent(): Promise<{ revision: number; content: unknown }> {
  await ensureSchema();
  const [rows] = await database().execute<RowDataPacket[]>('SELECT revision, document FROM cms_document WHERE id = 1');
  if (!rows.length) return { revision: 0, content: null };
  return { revision: Number(rows[0]['revision']), content: JSON.parse(String(rows[0]['document'])) as unknown };
}

export async function publishContent(revision: number, content: unknown): Promise<
  { revision: number; content: unknown } | { conflict: number }
> {
  await ensureSchema();
  const connection = await database().getConnection();
  try {
    await connection.beginTransaction();
    const [rows] = await connection.execute<RowDataPacket[]>('SELECT revision FROM cms_document WHERE id = 1 FOR UPDATE');
    const current = rows.length ? Number(rows[0]['revision']) : 0;
    if (current !== revision) {
      await connection.rollback();
      return { conflict: current };
    }
    const next = current + 1;
    const encoded = JSON.stringify(content);
    if (rows.length) {
      await connection.execute('UPDATE cms_document SET revision = ?, document = ? WHERE id = 1', [next, encoded]);
    } else {
      await connection.execute('INSERT INTO cms_document (id, revision, document) VALUES (1, ?, ?)', [next, encoded]);
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
