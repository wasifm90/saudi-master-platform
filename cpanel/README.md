# Current deployment

The public frontend is now Angular with static prerendering. Follow the root [README](../README.md#namecheap--apache-deployment).

Upload only `dist/website/browser/`, including its `.htaccess`. No PHP/MySQL/Node runtime is required for the static frontend. The old schema and backend examples are retained as references, not as a functioning CMS. Do not upload `archive/legacy` or the repository root.
