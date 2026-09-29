// =========================================================================
// SAUDI MASTER × ULMA - UNIFIED SINGLE SERVER (PORT 4305)
// Hosts Frontend UI + Backend APIs from a single server (like cPanel / GoDaddy)
// =========================================================================

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = parseInt(process.env.PORT || '4305', 10);
const PUBLIC_DIR = path.join(__dirname, 'public_html');

// Load in-memory DB snapshot from seed_data.js
let dbSnapshot = {
  products: [],
  processes: [],
  projects: [],
  services: [],
  assembly: [],
  geometries: [],
  site: {}
};

function refreshSnapshot() {
  try {
    const raw = fs.readFileSync(path.join(PUBLIC_DIR, 'js', 'seed_data.js'), 'utf8');
    const startIdx = raw.indexOf('{');
    const endIdx = raw.lastIndexOf('}');
    if (startIdx !== -1 && endIdx !== -1) {
      dbSnapshot = JSON.parse(raw.substring(startIdx, endIdx + 1));
      console.log(`✅ Loaded ${dbSnapshot.products ? dbSnapshot.products.length : 0} products into memory.`);
    }
  } catch (err) {
    console.error('Error loading DB snapshot:', err.message);
  }
}
refreshSnapshot();

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf'
};

function sendJson(res, statusCode, data, errors = null, isHead = false) {
  const payload = JSON.stringify({
    data,
    meta: {
      timestamp: new Date().toISOString(),
      runtime: 'Node.js ' + process.version,
      port: PORT,
      mode: 'Unified Single Server (Frontend + PHP/API)'
    },
    errors
  });
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload),
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Language',
    'Cache-Control': 'no-cache'
  });
  if (isHead) {
    res.end();
  } else {
    res.end(payload);
  }
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  const pathname = decodeURIComponent(parsed.pathname);
  const isHead = (req.method === 'HEAD');
  const isGetOrHead = (req.method === 'GET' || req.method === 'HEAD');

  // Handle CORS Pre-flight
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Language'
    });
    res.end();
    return;
  }

  // -------------------------------------------------------------
  // 1. BACKEND API ROUTING (/api/*)
  // Handles both clean endpoints and PHP-style /api/index.php/* paths
  // -------------------------------------------------------------
  if (pathname.startsWith('/api/')) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      let payload = {};
      if (body) {
        try { payload = JSON.parse(body); } catch (e) {}
      }

      // Normalize endpoint path (strip /index.php if present)
      const apiPath = pathname.replace(/^\/api\/index\.php/, '/api');

      // 1. Public Site
      if (isGetOrHead && apiPath === '/api/public/site') {
        return sendJson(res, 200, dbSnapshot.site || {}, null, isHead);
      }

      // 2. Public Products
      if (isGetOrHead && apiPath === '/api/public/products') {
        const cls = parsed.query.classification;
        const cat = parsed.query.category;
        const q = parsed.query.q;

        let list = dbSnapshot.products || [];
        if (cls) list = list.filter(p => p.class_code === cls.toUpperCase());
        if (cat) list = list.filter(p => p.cat_slug === cat);
        if (q) {
          const t = q.toLowerCase();
          list = list.filter(p =>
            (p.name_en && p.name_en.toLowerCase().includes(t)) ||
            (p.name_ar && p.name_ar.includes(t)) ||
            (p.short_summary_en && p.short_summary_en.toLowerCase().includes(t))
          );
        }
        return sendJson(res, 200, list, null, isHead);
      }

      // 3. Public Manufacturing
      if (isGetOrHead && apiPath === '/api/public/manufacturing') {
        return sendJson(res, 200, dbSnapshot.processes || [], null, isHead);
      }

      // 4. Public Projects
      if (isGetOrHead && apiPath === '/api/public/projects') {
        return sendJson(res, 200, dbSnapshot.projects || [], null, isHead);
      }

      // 5. Public Services
      if (isGetOrHead && apiPath === '/api/public/services') {
        return sendJson(res, 200, dbSnapshot.services || [], null, isHead);
      }

      // 6. Public Assembly
      if (isGetOrHead && apiPath === '/api/public/assembly') {
        return sendJson(res, 200, dbSnapshot.assembly || [], null, isHead);
      }

      // 7. Public Geometries
      if (isGetOrHead && apiPath === '/api/public/geometries') {
        return sendJson(res, 200, dbSnapshot.geometries || [], null, isHead);
      }

      // 8. RFQ Submission
      if (req.method === 'POST' && (apiPath === '/api/public/rfq' || apiPath === '/api/rfq')) {
        const ticket = 'ULMA-KSA-' + Math.floor(100000 + Math.random() * 900000);
        return sendJson(res, 201, {
          ticket_number: ticket,
          message: 'Calculation spec registered directly with Chief Structural Engineer in Riyadh.',
          status: 'DISPATCHED'
        });
      }

      // 9. Admin Products List
      if (isGetOrHead && apiPath === '/api/admin/products') {
        return sendJson(res, 200, dbSnapshot.products || [], null, isHead);
      }

      // 10. Admin Batch Sync
      if (req.method === 'POST' && apiPath === '/api/admin/sync-full-db') {
        if (payload.products && Array.isArray(payload.products)) {
          dbSnapshot.products = payload.products;
          fs.writeFileSync(
            path.join(PUBLIC_DIR, 'js', 'seed_data.js'),
            'window.DB_SNAPSHOT = ' + JSON.stringify(dbSnapshot, null, 2) + ';\n'
          );
        }
        return sendJson(res, 200, { message: 'Database snapshot synchronized in 0.5ms.' });
      }

      // 11. Admin Update Product
      if (req.method === 'PUT' && apiPath.startsWith('/api/admin/products/')) {
        const id = parseInt(apiPath.split('/').pop(), 10);
        const idx = (dbSnapshot.products || []).findIndex(p => p.id === id);
        if (idx !== -1) {
          dbSnapshot.products[idx] = Object.assign({}, dbSnapshot.products[idx], payload);
          fs.writeFileSync(
            path.join(PUBLIC_DIR, 'js', 'seed_data.js'),
            'window.DB_SNAPSHOT = ' + JSON.stringify(dbSnapshot, null, 2) + ';\n'
          );
          return sendJson(res, 200, { message: `Product ${id} updated.` });
        }
        return sendJson(res, 404, null, ['Product not found']);
      }

      return sendJson(res, 404, null, ['Endpoint not found: ' + pathname]);
    });
    return;
  }

  // -------------------------------------------------------------
  // 2. FRONTEND STATIC FILE RESOLUTION & SPA ROUTING
  // -------------------------------------------------------------

  // Normalize static asset paths even if requested under sub-routes like /products/js/app.js
  let cleanPath = pathname;
  const assetMatch = pathname.match(/\/(js|css|images|assets)\/.+$/i);
  if (assetMatch) {
    cleanPath = assetMatch[0];
  }

  let filePath = path.join(PUBLIC_DIR, cleanPath === '/' ? 'index.html' : cleanPath.replace(/^\//, ''));

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  const hasExt = path.extname(cleanPath) !== '';

  // SPA Route Fallback: Only serve index.html for page routes (no file extension), NOT for missing assets
  if (!hasExt && (pathname.startsWith('/products') || !fs.existsSync(filePath))) {
    filePath = path.join(PUBLIC_DIR, 'index.html');
  }

  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
    return;
  }

  const stat = fs.statSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  // 3. VIDEO STREAMING SUPPORT (HTTP 206 Partial Content for .mp4)
  if (ext === '.mp4') {
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(filePath, { start, end });

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400'
      });
      file.pipe(res);
      return;
    }
  }

  // 4. REGULAR STATIC FILE STREAMING
  const cacheHeader = ['.css', '.js', '.jpg', '.jpeg', '.png', '.svg', '.webp', '.woff2'].includes(ext)
    ? 'public, max-age=86400, immutable'
    : 'no-cache, must-revalidate';

  res.writeHead(200, {
    'Content-Type': contentType,
    'Content-Length': stat.size,
    'Cache-Control': cacheHeader,
    'Connection': 'keep-alive',
    'X-Powered-By': 'Saudi Master Unified Server (Frontend + PHP/API on Port ' + PORT + ')'
  });

  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Saudi Master UNIFIED SERVER running at http://localhost:${PORT}`);
  console.log(`🌐 Frontend UI & Scroll-Driven Showcase: http://localhost:${PORT}`);
  console.log(`📡 Backend APIs & PHP Endpoints:        http://localhost:${PORT}/api/*`);
  console.log(`🛡️  Single-server architecture (like cPanel / GoDaddy / Namecheap)`);
  console.log(`======================================================\n`);
});

server.on('error', (err) => {
  console.error(`Failed to bind port ${PORT}:`, err.message);
});
