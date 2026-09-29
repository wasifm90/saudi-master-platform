import { adminHash, databaseConfigured, publishContent, readContent } from '../database';
import { input, json, mutationError, validDocument } from '../shared';

export async function GET(): Promise<Response> {
  if (!databaseConfigured()) return json({ revision: 0, content: null });
  try {
    return json(await readContent());
  } catch (error) {
    console.error('CMS content read:', error);
    return json({ error: 'Published content is temporarily unavailable.' }, 503);
  }
}

export async function PUT(request: Request): Promise<Response> {
  if (!databaseConfigured()) return json({ error: 'CMS database is not configured.' }, 503);
  let hash: string | null;
  try {
    hash = await adminHash();
  } catch {
    return json({ error: 'CMS database is unavailable.' }, 503);
  }
  const error = mutationError(request, request.headers.get('x-csrf-token'), hash);
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
    const result = await publishContent(Number(supplied['revision']), supplied['content']);
    if ('conflict' in result) return json({ error: 'Content changed in another session. Reload before saving.', revision: result.conflict }, 409);
    return json(result);
  } catch (error) {
    console.error('CMS content write:', error);
    return json({ error: 'Could not save content.' }, 503);
  }
}
