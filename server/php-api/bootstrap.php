<?php
declare(strict_types=1);

function cms_json(int $status, array $body): never {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function cms_database(): PDO {
    $host = getenv('CMS_DB_HOST');
    $name = getenv('CMS_DB_NAME');
    $user = getenv('CMS_DB_USER');
    $pass = getenv('CMS_DB_PASSWORD');
    if (!$host || !$name || !$user || $pass === false) {
        cms_json(503, ['error' => 'CMS database is not configured.']);
    }
    try {
        $db = new PDO(
            "mysql:host={$host};dbname={$name};charset=utf8mb4",
            $user,
            $pass,
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC],
        );
        $db->exec('CREATE TABLE IF NOT EXISTS cms_document (
            id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
            revision INT UNSIGNED NOT NULL,
            document LONGTEXT NOT NULL,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4');
        return $db;
    } catch (Throwable $error) {
        error_log('CMS database: ' . $error->getMessage());
        cms_json(503, ['error' => 'CMS database is unavailable.']);
    }
}

function cms_session(): void {
    if (session_status() === PHP_SESSION_ACTIVE) return;
    session_name('sm_cms');
    session_set_cookie_params([
        'httponly' => true,
        'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
        'samesite' => 'Strict',
        'path' => '/',
    ]);
    session_start();
}

function cms_require_admin(): void {
    cms_session();
    if (empty($_SESSION['cms_admin'])) cms_json(401, ['error' => 'Sign in required.']);
    $expected = (string) ($_SESSION['cms_csrf'] ?? '');
    $received = (string) ($_SERVER['HTTP_X_CSRF_TOKEN'] ?? '');
    if (!$expected || !hash_equals($expected, $received)) {
        cms_json(403, ['error' => 'Session check failed. Refresh and sign in again.']);
    }
}

function cms_input(int $maxBytes = 4000000): array {
    $length = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
    if ($length > $maxBytes) cms_json(413, ['error' => 'Content is too large.']);
    $raw = file_get_contents('php://input', false, null, 0, $maxBytes + 1);
    if ($raw === false || strlen($raw) > $maxBytes) cms_json(413, ['error' => 'Content is too large.']);
    try {
        $value = json_decode($raw, true, 64, JSON_THROW_ON_ERROR);
    } catch (Throwable $error) {
        cms_json(400, ['error' => 'Invalid JSON.']);
    }
    if (!is_array($value)) cms_json(400, ['error' => 'Expected a JSON object.']);
    return $value;
}

function cms_validate_document(mixed $document): void {
    if (!is_array($document)) cms_json(422, ['error' => 'Expected a content document.']);
    foreach (['products', 'geometries', 'assembly', 'projects', 'services', 'processes', 'industries', 'articles', 'jobs', 'navigation'] as $key) {
        if (!isset($document[$key]) || !is_array($document[$key]) || !array_is_list($document[$key])) {
            cms_json(422, ['error' => "Invalid {$key} collection."]);
        }
    }
    foreach (['company', 'home', 'pages', 'collectionCopy', 'media', 'labels', 'visibility'] as $key) {
        if (!isset($document[$key]) || !is_array($document[$key])) {
            cms_json(422, ['error' => "Invalid {$key} content."]);
        }
    }
    $slugs = [];
    foreach ($document['products'] as $product) {
        if (!is_array($product) || !is_string($product['slug'] ?? null) || !preg_match('/^[a-z0-9-]+$/', $product['slug'])) {
            cms_json(422, ['error' => 'Every product needs a valid slug.']);
        }
        if (!is_string($product['name'] ?? null) || trim($product['name']) === '') {
            cms_json(422, ['error' => 'Every product needs a name.']);
        }
        if (!is_string($product['featuredImage'] ?? null) || trim($product['featuredImage']) === '') {
            cms_json(422, ['error' => 'Every product needs a featured image.']);
        }
        if (isset($slugs[$product['slug']])) cms_json(422, ['error' => 'Product slugs must be unique.']);
        $slugs[$product['slug']] = true;
    }
}
