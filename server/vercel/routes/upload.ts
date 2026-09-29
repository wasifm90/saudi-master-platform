import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { adminHash, databaseConfigured, recordMedia } from '../database';
import { input, json, mutationError } from '../shared';

const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'video/mp4', 'video/webm'];

export async function POST(request: Request): Promise<Response> {
  if (!databaseConfigured() || !process.env['BLOB_READ_WRITE_TOKEN']) {
    return json({ error: 'CMS database or media storage is not configured.' }, 503);
  }
  let body: HandleUploadBody;
  try {
    body = await input(request, 64_000) as HandleUploadBody;
  } catch {
    return json({ error: 'Invalid upload request.' }, 400);
  }
  try {
    const hash = await adminHash();
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const error = mutationError(request, clientPayload, hash);
        if (error) throw new Error('Sign in required to upload.');
        if (!/^cms\/media\/[a-zA-Z0-9._-]+$/.test(pathname)) throw new Error('Invalid upload path.');
        return { allowedContentTypes: allowed, maximumSizeInBytes: 50_000_000, addRandomSuffix: true };
      },
      onUploadCompleted: async ({ blob }) => {
        await recordMedia(blob.url, blob.pathname, blob.contentType);
      },
    });
    return json(result);
  } catch (error) {
    console.error('CMS upload:', error);
    return json({ error: error instanceof Error ? error.message : 'Upload failed.' }, 400);
  }
}
