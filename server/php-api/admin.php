<?php
declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';
cms_session();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    cms_json(200, [
        'authenticated' => !empty($_SESSION['cms_admin']),
        'configured' => (bool) getenv('CMS_ADMIN_PASSWORD_HASH'),
        'csrf' => !empty($_SESSION['cms_admin']) ? $_SESSION['cms_csrf'] : null,
    ]);
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') cms_json(405, ['error' => 'Method not allowed.']);
$input = cms_input(4096);
$action = $input['action'] ?? '';
if ($action === 'logout') {
    cms_require_admin();
    $_SESSION = [];
    session_destroy();
    cms_json(200, ['authenticated' => false]);
}
if ($action !== 'login') cms_json(400, ['error' => 'Unknown action.']);
$hash = getenv('CMS_ADMIN_PASSWORD_HASH');
if (!$hash) cms_json(503, ['error' => 'Set CMS_ADMIN_PASSWORD_HASH on the hosting account first.']);
if (($_SESSION['cms_attempts'] ?? 0) >= 10 && time() - ($_SESSION['cms_attempt_at'] ?? 0) < 900) {
    cms_json(429, ['error' => 'Too many attempts. Try again later.']);
}
$password = (string) ($input['password'] ?? '');
if (!password_verify($password, $hash)) {
    $_SESSION['cms_attempts'] = ($_SESSION['cms_attempts'] ?? 0) + 1;
    $_SESSION['cms_attempt_at'] = time();
    cms_json(401, ['error' => 'Incorrect password.']);
}
session_regenerate_id(true);
$_SESSION['cms_admin'] = true;
$_SESSION['cms_csrf'] = bin2hex(random_bytes(24));
unset($_SESSION['cms_attempts'], $_SESSION['cms_attempt_at']);
cms_json(200, ['authenticated' => true, 'csrf' => $_SESSION['cms_csrf']]);
