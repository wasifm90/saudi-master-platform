# Admin publishing on Vercel

The Vercel deployment uses Node.js Functions in the root `api/` directory. `/api/admin` authenticates editors, `/api/content` reads and publishes a versioned site document, and `/api/upload` issues short-lived Vercel Blob upload tokens. Images and videos upload directly from the browser to Blob, avoiding the Vercel Function request-size limit. The public site loads the saved document at runtime and uses its bundled catalogue until the first publish.

## One-time project setup

1. In the Vercel project, open **Storage**, create a **Blob** store with public access, and connect it to this project. Vercel supplies `BLOB_READ_WRITE_TOKEN` to connected deployments.
2. In **Settings → Environment Variables**, add `CMS_ADMIN_PASSWORD_HASH` for Production. Generate a bcrypt hash locally, for example with `htpasswd -nBC 12 admin` (enter the password at its interactive prompts, then copy the portion after `admin:`). Never put the password or hash in Git or `NEXT_PUBLIC_`/`VITE_` variables.
3. Redeploy after the store and environment variable are connected. Visit `/api/admin`: it must return JSON with `configured: true`. Visit `/api/content`: before the first publish it returns revision `0` and null content.
4. Sign in at `/admin`, review the bundled content, and choose **Publish changes**. Check a second browser/device for the published content. Upload an image and verify its returned Blob URL renders.

The session is signed, HttpOnly, SameSite Strict and expires after 12 hours. Changing `CMS_ADMIN_PASSWORD_HASH` invalidates existing sessions. Publishing uses revision and Blob ETag checks to reject stale writes. Blob content and uploaded media are public; do not publish secrets through the editor. Back up the content document and media from the connected Blob store on the hosting schedule.

`npm run build` includes no PHP files. The old PHP/MySQL backend remains available as a separate Apache package through `npm run build:php`; see [ADMIN_SETUP.md](ADMIN_SETUP.md).
