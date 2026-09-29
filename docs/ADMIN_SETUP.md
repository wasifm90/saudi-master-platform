# Admin publishing on PHP/MySQL hosting

The Angular build includes a `/admin` editor and three PHP endpoints under `/api`. The editor covers homepage sections, navigation, page copy, collections, products, company details, and images/videos. Publishing saves one versioned JSON document in MySQL. The public site fetches that document at runtime, with the bundled catalogue as its initial fallback.

## Requirements

- PHP 8.1 or newer with PDO MySQL, Fileinfo, sessions, and JSON extensions.
- MySQL or MariaDB database and a user with `CREATE`, `SELECT`, `INSERT`, and `UPDATE` privileges on it. The API creates `cms_document` on first use.
- HTTPS, writable `assets/uploads` directory, and PHP `upload_max_filesize` and `post_max_size` set above the desired upload size (maximum accepted by this API: 50 MB).

## Deploy

1. Run `npm ci && npm run build` locally or in CI. Upload the **contents** of `dist/website/browser/` to the website's Apache document root. Keep `api/`, `.htaccess`, and `assets/uploads/.htaccess`. Do not upload the TypeScript source or `node_modules`.
2. Set these server environment variables in the PHP host configuration: `CMS_DB_HOST`, `CMS_DB_NAME`, `CMS_DB_USER`, `CMS_DB_PASSWORD`, `CMS_ADMIN_PASSWORD_HASH`. Keep their values out of Git and the public document root.
3. Generate the admin password hash with `php -r 'echo password_hash("YOUR_LONG_UNIQUE_PASSWORD", PASSWORD_DEFAULT), PHP_EOL;'` on a trusted machine. Store only the result in `CMS_ADMIN_PASSWORD_HASH`.
4. Open `/api/admin.php`; it should return JSON with `configured: true`. Open `/api/content.php`; it should return revision `0` and null content before first publish. Sign in at `/admin`, review the seeded document, and click **Publish changes** to create revision 1.
5. Confirm a published edit on a second browser/device. Test one image upload and its resulting public URL. Back up both the MySQL `cms_document` table and `assets/uploads` on the hosting schedule.

The local `npm run preview` server emulates the API for development. Its generated password and content are stored in ignored `.local-cms/`; this has no role in production.

The browser fetches published content after initial load. Existing static prerendered HTML contains the bundled catalogue until JavaScript hydrates. Newly added product routes are client-rendered. If immediately updated server-rendered content and metadata are required for search indexing or social previews, add an SSR deployment or a publish-triggered rebuild to the hosting workflow.
