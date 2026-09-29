import { afterEach, describe, expect, it } from 'vitest';
import { mutationError, newSessionCookie, session, validDocument } from './shared';

const hash = 'test-hash';

describe('admin session', () => {
  it('rejects a forged cookie and mismatched CSRF token', () => {
    const request = new Request('https://example.com/api/content');
    const { cookie, csrf } = newSessionCookie(request, hash);
    const cookiePair = cookie.split(';')[0];
    const authorized = new Request(request.url, { headers: { cookie: cookiePair, origin: 'https://example.com' } });
    expect(session(authorized, hash)?.csrf).toBe(csrf);
    expect(mutationError(authorized, csrf, hash)).toBeNull();
    expect(mutationError(authorized, 'wrong', hash)?.status).toBe(403);
    const forged = new Request(request.url, { headers: { cookie: `${cookiePair}forged` } });
    expect(session(forged, hash)).toBeNull();
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
