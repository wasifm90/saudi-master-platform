<?php
declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';

try {
    $db = cms_database();
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $row = $db->query('SELECT revision, document FROM cms_document WHERE id = 1')->fetch();
        cms_json(200, [
            'revision' => $row ? (int) $row['revision'] : 0,
            'content' => $row ? json_decode($row['document'], true) : null,
        ]);
    }
    if ($_SERVER['REQUEST_METHOD'] !== 'PUT') cms_json(405, ['error' => 'Method not allowed.']);
    cms_require_admin();
    $input = cms_input();
    $revision = $input['revision'] ?? null;
    if (!is_int($revision) || $revision < 0) cms_json(422, ['error' => 'Invalid revision.']);
    $document = $input['content'] ?? null;
    cms_validate_document($document);
    $db->beginTransaction();
    $row = $db->query('SELECT revision FROM cms_document WHERE id = 1 FOR UPDATE')->fetch();
    $current = $row ? (int) $row['revision'] : 0;
    if ($revision !== $current) {
        $db->rollBack();
        cms_json(409, ['error' => 'Content changed in another session. Reload before saving.', 'revision' => $current]);
    }
    $next = $current + 1;
    $encoded = json_encode($document, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
    if ($row) {
        $statement = $db->prepare('UPDATE cms_document SET revision = ?, document = ? WHERE id = 1');
        $statement->execute([$next, $encoded]);
    } else {
        $statement = $db->prepare('INSERT INTO cms_document (id, revision, document) VALUES (1, ?, ?)');
        $statement->execute([$next, $encoded]);
    }
    $db->commit();
    cms_json(200, ['revision' => $next, 'content' => $document]);
} catch (Throwable $error) {
    if (isset($db) && $db->inTransaction()) $db->rollBack();
    error_log('CMS content: ' . $error->getMessage());
    cms_json(500, ['error' => 'Could not save content.']);
}
