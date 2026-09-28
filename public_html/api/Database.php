<?php
require_once __DIR__ . '/config.php';

class Database {
    private static ?PDO $instance = null;

    public static function getConnection(): PDO {
        if (self::$instance === null) {
            if (DB_TYPE === 'mysql') {
                try {
                    $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";
                    self::$instance = new PDO($dsn, DB_USER, DB_PASS, [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                        PDO::ATTR_EMULATE_PREPARES => false
                    ]);
                } catch (Throwable $e) {
                    error_log("MySQL connection error: " . $e->getMessage() . ". Falling back to SQLite.");
                    self::$instance = null;
                }
            }

            if (self::$instance === null) {
                try {
                    self::$instance = new PDO("sqlite:" . SQLITE_DB_PATH, null, null, [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                    ]);
                } catch (Throwable $e) {
                    http_response_code(500);
                    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
                    exit;
                }
            }
        }
        return self::$instance;
    }
}
