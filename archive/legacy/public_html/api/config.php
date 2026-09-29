<?php
/**
 * Saudi Master Company (ULMA Alliance)
 * High-Performance PHP REST API Configuration
 * Modeled after EduCommunity GoDaddy / cPanel deployment
 */

error_reporting(E_ALL & ~E_NOTICE & ~E_DEPRECATED);
ini_set('display_errors', '0');

defined('DB_TYPE') or define('DB_TYPE', getenv('DB_TYPE') ?: 'sqlite');
defined('DB_HOST') or define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
defined('DB_PORT') or define('DB_PORT', getenv('DB_PORT') ?: '3306');
defined('DB_NAME') or define('DB_NAME', getenv('DB_NAME') ?: 'saudi_master_db');
defined('DB_USER') or define('DB_USER', getenv('DB_USER') ?: 'root');
defined('DB_PASS') or define('DB_PASS', getenv('DB_PASS') ?: '');

$projectRoot = dirname(dirname(__DIR__));
defined('SQLITE_DB_PATH') or define('SQLITE_DB_PATH', $projectRoot . '/database/saudi_master.db');
defined('UPLOAD_DIR') or define('UPLOAD_DIR', dirname(__DIR__) . '/uploads');

if (!is_dir(UPLOAD_DIR)) {
    @mkdir(UPLOAD_DIR, 0755, true);
}
