# Admin publishing on Vercel with TiDB Cloud

The `/admin` workspace manages pages, products, sections, navigation, copy and media. Vercel Functions provide its API. A TiDB Cloud database (MySQL-compatible) stores the administrator password hash, the revisioned site document and media metadata. Image/video files live in Vercel Blob; the content document stores their public URLs. The site uses its bundled catalogue until the first publish.

## Connect storage

1. Create a TiDB Cloud Serverless cluster and connect it to the Vercel project using the [TiDB Cloud Vercel integration](https://vercel.com/marketplace/tidb-cloud). It supplies `TIDB_HOST`, `TIDB_PORT`, `TIDB_USER`, `TIDB_PASSWORD` and `TIDB_DATABASE`. The API connects with TLS and creates `cms_admin`, `cms_document` and `cms_media` on first use. The TiDB account must have table creation, read, insert and update privileges.
2. In the Vercel project, create and connect a public Blob store for images and videos. It supplies `BLOB_READ_WRITE_TOKEN` to the deployment.
3. Generate a bcrypt hash of the initial administrator password locally. One option is `htpasswd -nBC 12 admin`; enter the password interactively and copy only the part after `admin:`. In Vercel **Settings → Environment Variables**, set `CMS_ADMIN_BOOTSTRAP_HASH` to that hash for Production. Do not put the password or hash in Git, a public environment variable, or the frontend bundle.
4. Redeploy after the database, Blob store and bootstrap hash are connected. The first API request inserts the hash into the `cms_admin` MySQL table if no administrator exists. The bootstrap variable can then be removed and the project redeployed again; the stored hash remains in MySQL.
5. Visit `/api/admin` and confirm `configured: true`. Sign in at `/admin`, review the bundled content and choose **Publish changes**. Verify an edit from a second browser/device, upload an image and check the returned URL. The admin panel also has **Change password**, which updates the MySQL hash and signs out existing sessions.

If using another remote MySQL provider, set `CMS_DB_HOST`, `CMS_DB_PORT`, `CMS_DB_NAME`, `CMS_DB_USER`, `CMS_DB_PASSWORD` and `CMS_DB_SSL=true` in Vercel project settings instead of the `TIDB_*` variables. `CMS_DB_SSL_CA` can contain a custom CA certificate. The database must accept connections from Vercel Functions.

Sessions are signed, HttpOnly, SameSite Strict and expire after 12 hours. Publishing uses a MySQL transaction and revision check to reject stale writes. Back up the database and Blob media. Public content and uploaded files must not contain secrets.

`npm run build` excludes the old PHP API. An alternate Apache/PHP/MySQL package remains available through `npm run build:php`; see [ADMIN_SETUP.md](ADMIN_SETUP.md).
