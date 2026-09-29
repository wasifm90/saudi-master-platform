<?php
declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') cms_json(405, ['error' => 'Method not allowed.']);
cms_require_admin();
if (!isset($_FILES['file']) || !is_uploaded_file($_FILES['file']['tmp_name'])) {
    cms_json(400, ['error' => 'Choose an image or video file.']);
}
$file = $_FILES['file'];
if ($file['error'] !== UPLOAD_ERR_OK || $file['size'] > 50000000) {
    cms_json(413, ['error' => 'Upload failed or exceeds 50 MB.']);
}
$mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
$extensions = [
    'image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp',
    'image/avif' => 'avif', 'video/mp4' => 'mp4', 'video/webm' => 'webm',
];
if (!isset($extensions[$mime])) cms_json(415, ['error' => 'Use JPG, PNG, WebP, AVIF, MP4 or WebM.']);
$directory = dirname(__DIR__) . '/assets/uploads';
if (!is_dir($directory) && !mkdir($directory, 0755, true)) {
    cms_json(500, ['error' => 'Upload directory is unavailable.']);
}
$name = bin2hex(random_bytes(16)) . '.' . $extensions[$mime];
if (!move_uploaded_file($file['tmp_name'], $directory . '/' . $name)) {
    cms_json(500, ['error' => 'Could not save upload.']);
}
cms_json(201, ['url' => '/assets/uploads/' . $name]);
