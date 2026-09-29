import { BlobPreconditionFailedError, get, put } from '@vercel/blob';
import { configured, input, json, mutationError, validDocument } from '../server/vercel/shared';

const pathname = 'cms/site-content.json';
type Saved = { revision: number; content: unknown };

async function current(): Promise<{ saved: Saved; etag: string | null }> {
  const result = await get(pathname, { access: 'public', useCache: false });
  if (!result) return { saved: { revision: 0, content: null }, etag: null };
  const saved = JSON.parse(await new Response(result.stream).text()) as Saved;
  if (!Number.isSafeInteger(saved.revision) || saved.revision < 0) throw new Error('Invalid saved revision.');
  return { saved, etag: result.blob.etag };
}

export async function GET(): Promise<Response> {
  if (!process.env['BLOB_READ_WRITE_TOKEN']) return json({ revision: 0, content: null }, 200);
  try {
    return json((await current()).saved);
  } catch (error) {
    console.error('CMS content read:', error);
    return json({ error: 'Published content is temporarily unavailable.' }, 503);
  }
}

export async function PUT(request: Request): Promise<Response> {
  if (!configured()) return json({ error: 'Admin storage or password is not configured.' }, 503);
  const error = mutationError(request, request.headers.get('x-csrf-token'));
  if (error) return error;
  let body: unknown;
  try {
    body = await input(request);
  } catch {
    return json({ error: 'Invalid JSON or content is too large.' }, 400);
  }
  if (!body || typeof body !== 'object') return json({ error: 'Invalid content document.' }, 422);
  const supplied = body as Record<string, unknown>;
  if (!Number.isSafeInteger(supplied['revision']) || Number(supplied['revision']) < 0 ||
      !validDocument(supplied['content'])) return json({ error: 'Invalid content document.' }, 422);
  try {
    const { saved, etag } = await current();
    if (saved.revision !== supplied['revision']) {
      return json({ error: 'Content changed in another session. Reload before saving.', revision: saved.revision }, 409);
    }
    const next = { revision: saved.revision + 1, content: supplied['content'] };
    await put(pathname, JSON.stringify(next), {
      access: 'public',
      contentType: 'application/json',
      allowOverwrite: Boolean(etag),
      ...(etag ? { ifMatch: etag } : {}),
    });
    return json(next);
  } catch (error) {
    if (error instanceof BlobPreconditionFailedError) {
      return json({ error: 'Content changed in another session. Reload before saving.' }, 409);
    }
    console.error('CMS content write:', error);
    return json({ error: 'Could not save content.' }, 503);
  }
}
