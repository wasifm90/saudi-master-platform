# Current deployment

The public frontend is now Angular with static prerendering. Follow the root [README](../README.md#namecheap--apache-deployment).

For the editable site, run `npm run build:php` and upload only `dist/website/browser/`, including its `.htaccess` and `api/` directory. PHP 8.1+ and MySQL are required for the admin CMS; see [ADMIN_SETUP.md](../docs/ADMIN_SETUP.md). No Node runtime is needed on the host. Do not upload `archive/legacy` or the repository root.
