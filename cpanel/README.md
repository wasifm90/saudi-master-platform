# Saudi Master Company (ULMA Alliance) - Production Deployment Guide
## Target: Namecheap / cPanel Hosting (PHP 8.2+ & MySQL 8.x)

This platform is engineered to run seamlessly on standard cPanel / Namecheap shared, reseller, VPS, or dedicated hosting without requiring root access, Docker, or Node background processes.

---

### Step 1: Database Setup
1. Log into your **cPanel**.
2. Navigate to **MySQL® Databases**.
3. Create a new database: e.g. `saudimas_db`.
4. Create a new MySQL user: e.g. `saudimas_user` with a strong password.
5. Add the user to the database and grant **ALL PRIVILEGES**.
6. Open **phpMyAdmin**, select `saudimas_db`, and import the file `database/schema.sql` (or `cpanel/schema.sql`). All tables, indexes, and initial systems will be populated.

---

### Step 2: Laravel Backend Deployment
1. Upload the contents of the `backend/` directory to a folder outside the public web root (e.g., `/home/username/saudi-master-backend`).
2. Copy `.env.example` to `.env`.
3. Edit `.env` with your database credentials:
   ```dotenv
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=saudimas_db
   DB_USERNAME=saudimas_user
   DB_PASSWORD=YOUR_STRONG_PASSWORD
   APP_URL=https://saudimaster.com
   APP_ENV=production
   APP_DEBUG=false
   ```
4. Set directory permissions:
   ```bash
   chmod -R 775 storage bootstrap/cache
   ```

---

### Step 3: Public Website & Client Assets Deployment
1. Upload the contents of `public_html/` into your domain's primary root (e.g. `/home/username/public_html` or `/public_html/saudimaster.com`).
2. Verify that the `.htaccess` file is present in `public_html/`. It enables:
   - HTTPS enforcement
   - GZIP/Brotli compression
   - Browser caching headers for static assets
   - HTML5 SPA routing (rewriting all non-file requests to `index.html`)
   - Secure routing of `/api/*` to the Laravel API router.

---

### Step 4: Storage Symlink & Media Uploads
In cPanel Terminal or via SSH:
```bash
php artisan storage:link
```
This ensures uploaded drawing PDFs, CAD files, and product brochures in `storage/app/public` are accessible via `/storage`.

---

### Step 5: Verification & Testing
1. Visit `https://saudimaster.com/` - check English display and Light Desert styling.
2. Toggle to Arabic (`عربي`) - verify instant RTL layout switch and Arabic typography.
3. Switch product classification tabs between **Local Made (KSA)** and **European / ULMA**.
4. Test the **RFQ Drawing Upload Form** - verify submission feedback.
5. Log into the **Admin CMS Portal** at `/admin` to edit product descriptions or reorder homepage sections. Changes update the database and reflect on the public site immediately without build steps!
