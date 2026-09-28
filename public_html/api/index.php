<?php
require_once __DIR__ . '/Database.php';

// Enable CORS & High-Speed Headers
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Language');
header('Cache-Control: public, max-age=300');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
// Normalize uri path
$uri = preg_replace('#^/api(/|$)#', '/', $uri);
if ($uri === '' || $uri === false) $uri = '/';
$method = $_SERVER['REQUEST_METHOD'];

$db = Database::getConnection();

function sendJson($status, $data, $errors = null) {
    http_response_code($status);
    echo json_encode([
        'data' => $data,
        'meta' => [
            'timestamp' => gmdate('Y-m-d\TH:i:s\Z'),
            'runtime' => 'PHP ' . PHP_VERSION,
            'api_version' => 'v2.0'
        ],
        'errors' => $errors
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

function getJsonInput() {
    $raw = file_get_contents('php://input');
    return $raw ? json_decode($raw, true) : [];
}

try {
    // -------------------------------------------------------------
    // PUBLIC ENDPOINTS
    // -------------------------------------------------------------
    if ($method === 'GET' && ($uri === '/public/site' || $uri === '/site')) {
        $stmt = $db->query("SELECT setting_value FROM site_settings WHERE setting_key = 'general'");
        $row = $stmt->fetch();
        $site = $row ? json_decode($row['setting_value'], true) : [];
        sendJson(200, $site);
    }

    if ($method === 'GET' && ($uri === '/public/classifications' || $uri === '/classifications')) {
        $stmt = $db->query("SELECT * FROM product_classifications WHERE is_active = 1 ORDER BY display_order");
        sendJson(200, $stmt->fetchAll());
    }

    if ($method === 'GET' && ($uri === '/public/categories' || $uri === '/categories')) {
        $stmt = $db->query("SELECT * FROM categories WHERE is_active = 1 ORDER BY display_order");
        sendJson(200, $stmt->fetchAll());
    }

    if ($method === 'GET' && ($uri === '/public/products' || $uri === '/products')) {
        $classification = $_GET['classification'] ?? null;
        $category = $_GET['category'] ?? null;
        $search = $_GET['q'] ?? null;

        $sql = "
            SELECT p.*, pc.code as class_code, b.name as brand_name, cat.slug as cat_slug
            FROM products p
            JOIN product_classifications pc ON p.classification_id = pc.id
            JOIN brands b ON p.brand_id = b.id
            JOIN categories cat ON p.category_id = cat.id
            WHERE p.status = 'PUBLISHED'
        ";
        $params = [];
        if ($classification) {
            $sql .= " AND pc.code = ?";
            $params[] = strtoupper($classification);
        }
        if ($category) {
            $sql .= " AND cat.slug = ?";
            $params[] = $category;
        }
        if ($search) {
            $sql .= " AND (p.name_en LIKE ? OR p.name_ar LIKE ? OR p.short_summary_en LIKE ?)";
            $term = "%$search%";
            $params[] = $term; $params[] = $term; $params[] = $term;
        }
        $sql .= " ORDER BY p.display_order ASC";

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll();

        foreach ($rows as &$r) {
            foreach (['key_advantages_en', 'key_advantages_ar', 'main_components_en', 'main_components_ar', 'technical_specs', 'regional_availability'] as $f) {
                if (!empty($r[$f]) && is_string($r[$f])) {
                    $decoded = json_decode($r[$f], true);
                    if ($decoded !== null) $r[$f] = $decoded;
                }
            }
        }
        sendJson(200, $rows);
    }

    if ($method === 'GET' && ($uri === '/public/manufacturing' || $uri === '/manufacturing')) {
        $stmt = $db->query("SELECT * FROM manufacturing_processes ORDER BY step_number ASC");
        $rows = $stmt->fetchAll();
        foreach ($rows as &$r) {
            $r['hero_image'] = $r['image_url'] ?? '';
        }
        sendJson(200, $rows);
    }

    if ($method === 'GET' && ($uri === '/public/projects' || $uri === '/projects')) {
        $stmt = $db->query("SELECT * FROM projects ORDER BY display_order ASC");
        $rows = $stmt->fetchAll();
        foreach ($rows as &$r) {
            if (!empty($r['key_metrics'])) {
                $r['metrics'] = json_decode($r['key_metrics'], true) ?: [];
            }
        }
        sendJson(200, $rows);
    }

    if ($method === 'GET' && ($uri === '/public/services' || $uri === '/services')) {
        $stmt = $db->query("SELECT * FROM services ORDER BY display_order ASC");
        sendJson(200, $stmt->fetchAll());
    }

    if ($method === 'GET' && ($uri === '/public/assembly' || $uri === '/assembly')) {
        $stmt = $db->query("SELECT * FROM assembly_steps ORDER BY step_number ASC");
        sendJson(200, $stmt->fetchAll());
    }

    // Lead / RFQ Submission
    if ($method === 'POST' && ($uri === '/public/rfq' || $uri === '/rfq')) {
        $input = getJsonInput();
        $ticket = 'ULMA-KSA-' . rand(100000, 999999);
        $fullName = $input['full_name'] ?? ($input['name'] ?? 'Inquiry');
        $email = $input['email'] ?? '';
        $phone = $input['phone'] ?? '';
        $company = $input['company_name'] ?? ($input['company'] ?? '');
        $system = $input['system_interest'] ?? ($input['system'] ?? '');
        $type = $input['transaction_type'] ?? ($input['type'] ?? 'UNSPECIFIED');

        $stmt = $db->prepare("
            INSERT INTO leads (ticket_number, full_name, email, phone, company_name, system_interest, transaction_type, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'NEW')
        ");
        $stmt->execute([$ticket, $fullName, $email, $phone, $company, $system, $type]);

        sendJson(201, [
            'ticket_number' => $ticket,
            'message' => 'Your temporary works engineering inquiry has been registered directly with the Chief Structural Engineer in Riyadh.',
            'status' => 'DISPATCHED'
        ]);
    }

    // -------------------------------------------------------------
    // ADMIN CMS ENDPOINTS
    // -------------------------------------------------------------
    if ($method === 'GET' && ($uri === '/admin/products' || $uri === '/admin/products')) {
        $stmt = $db->query("SELECT * FROM products ORDER BY display_order ASC");
        sendJson(200, $stmt->fetchAll());
    }

    if ($method === 'PUT' && preg_match('#^/admin/products/(\d+)$#', $uri, $m)) {
        $id = intval($m[1]);
        $input = getJsonInput();

        $stmt = $db->prepare("
            UPDATE products SET
                sku = COALESCE(?, sku),
                name_en = COALESCE(?, name_en),
                name_ar = COALESCE(?, name_ar),
                short_summary_en = COALESCE(?, short_summary_en),
                short_summary_ar = COALESCE(?, short_summary_ar),
                what_is_it_en = COALESCE(?, what_is_it_en),
                what_is_it_ar = COALESCE(?, what_is_it_ar),
                what_is_used_for_en = COALESCE(?, what_is_used_for_en),
                what_is_used_for_ar = COALESCE(?, what_is_used_for_ar),
                main_image = COALESCE(?, main_image),
                hero_image = COALESCE(?, hero_image),
                sales_available = COALESCE(?, sales_available),
                rental_available = COALESCE(?, rental_available),
                status = COALESCE(?, status),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        ");
        $stmt->execute([
            $input['sku'] ?? null,
            $input['name_en'] ?? null,
            $input['name_ar'] ?? null,
            $input['short_summary_en'] ?? null,
            $input['short_summary_ar'] ?? null,
            $input['what_is_it_en'] ?? null,
            $input['what_is_it_ar'] ?? null,
            $input['what_is_used_for_en'] ?? null,
            $input['what_is_used_for_ar'] ?? null,
            $input['main_image'] ?? null,
            $input['hero_image'] ?? null,
            $input['sales_available'] ?? null,
            $input['rental_available'] ?? null,
            $input['status'] ?? null,
            $id
        ]);

        sendJson(200, ['message' => "Product $id successfully updated via PHP Backend."]);
    }

    if ($method === 'POST' && ($uri === '/admin/sync-full-db' || $uri === '/admin/sync-full-db')) {
        $input = getJsonInput();
        if (!empty($input['products']) && is_array($input['products'])) {
            $stmt = $db->prepare("
                UPDATE products SET
                    sku = ?, name_en = ?, name_ar = ?,
                    short_summary_en = ?, short_summary_ar = ?,
                    what_is_it_en = ?, what_is_it_ar = ?,
                    what_is_used_for_en = ?, what_is_used_for_ar = ?,
                    main_image = ?, hero_image = ?,
                    sales_available = ?, rental_available = ?, status = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            ");
            foreach ($input['products'] as $p) {
                if (isset($p['id'])) {
                    $stmt->execute([
                        $p['sku'] ?? null,
                        $p['name_en'] ?? null,
                        $p['name_ar'] ?? null,
                        $p['short_summary_en'] ?? null,
                        $p['short_summary_ar'] ?? null,
                        $p['what_is_it_en'] ?? null,
                        $p['what_is_it_ar'] ?? null,
                        $p['what_is_used_for_en'] ?? null,
                        $p['what_is_used_for_ar'] ?? null,
                        $p['main_image'] ?? null,
                        $p['hero_image'] ?? null,
                        $p['sales_available'] ?? 1,
                        $p['rental_available'] ?? 1,
                        $p['status'] ?? 'PUBLISHED',
                        $p['id']
                    ]);
                }
            }
        }
        sendJson(200, ['message' => 'Full database successfully batch-synchronized via PHP Backend.']);
    }

    if ($method === 'GET' && ($uri === '/admin/leads' || $uri === '/admin/leads')) {
        $stmt = $db->query("SELECT * FROM leads ORDER BY created_at DESC");
        sendJson(200, $stmt->fetchAll());
    }

    sendJson(404, null, ["Endpoint $uri ($method) not found on PHP Backend"]);

} catch (Throwable $e) {
    sendJson(500, null, [$e->getMessage()]);
}
