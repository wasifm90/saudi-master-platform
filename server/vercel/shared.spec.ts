import { afterEach, describe, expect, it } from 'vitest';
import { configured, mutationError, newSessionCookie, session, validDocument } from './shared';

const originalHash = process.env['CMS_ADMIN_PASSWORD_HASH'];
const originalBlob = process.env['BLOB_READ_WRITE_TOKEN'];

afterEach(() => {
  if (originalHash === undefined) delete process.env['CMS_ADMIN_PASSWORD_HASH'];
  else process.env['CMS_ADMIN_PASSWORD_HASH'] = originalHash;
  if (originalBlob === undefined) delete process.env['BLOB_READ_WRITE_TOKEN'];
  else process.env['BLOB_READ_WRITE_TOKEN'] = originalBlob;
});

describe('admin session', () => {
  it('requires both the password hash and Blob storage', () => {
    delete process.env['CMS_ADMIN_PASSWORD_HASH'];
    delete process.env['BLOB_READ_WRITE_TOKEN'];
    expect(configured()).toBe(false);
    process.env['CMS_ADMIN_PASSWORD_HASH'] = 'test-hash';
    expect(configured()).toBe(false);
    process.env['BLOB_READ_WRITE_TOKEN'] = 'test-token';
    expect(configured()).toBe(true);
  });

  it('rejects a forged cookie and mismatched CSRF token', () => {
    process.env['CMS_ADMIN_PASSWORD_HASH'] = 'test-hash';
    process.env['BLOB_READ_WRITE_TOKEN'] = 'test-token';
    const request = new Request('https://example.com/api/content');
    const { cookie, csrf } = newSessionCookie(request);
    const cookiePair = cookie.split(';')[0];
    const authorized = new Request(request.url, { headers: { cookie: cookiePair, origin: 'https://example.com' } });
    expect(session(authorized)?.csrf).toBe(csrf);
    expect(mutationError(authorized, csrf)).toBeNull();
    expect(mutationError(authorized, 'wrong')?.status).toBe(403);
    const forged = new Request(request.url, { headers: { cookie: `${cookiePair}forged` } });
    expect(session(forged)).toBeNull();
  });
});

describe('published content', () => {
  it('rejects duplicate product slugs', () => {
    const document = {
      products: [
        { slug: 'system', name: 'System', featuredImage: '/system.webp' },
        { slug: 'system', name: 'System 2', featuredImage: '/system-2.webp' },
      ],
      geometries: [], assembly: [], projects: [], services: [], processes: [],
      industries: [], articles: [], jobs: [], navigation: [],
      company: {}, home: {}, pages: {}, collectionCopy: {}, media: {}, labels: {}, visibility: {},
    };
    expect(validDocument(document)).toBe(false);
    document.products[1].slug = 'system-2';
    expect(validDocument(document)).toBe(true);
  });
});
