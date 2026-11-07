<?php
/**
 * CRIMINAL ZOO - INBOX & DIRECT COMPLAINTS API
 */
require_once __DIR__ . '/db.php';

$messages = read_json_data('messages', []);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode(['status' => 'success', 'count' => count($messages), 'messages' => array_values($messages)], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input');
    $payload = json_decode($raw, true) ?: $_POST;
    $action = $payload['action'] ?? '';
    $id = $payload['id'] ?? '';

    if ($action === 'update_status') {
        $status = $payload['status'] ?? 'read';
        $found = null;
        foreach ($messages as &$m) {
            if ($m['id'] === $id) {
                $m['status'] = $status;
                $found = $m;
                break;
            }
        }
        unset($m);
        if ($found) {
            write_json_data('messages', $messages);
            echo json_encode(['status' => 'success', 'message' => $found], JSON_UNESCAPED_UNICODE);
            exit;
        }
    }

    if ($action === 'toggle_active') {
        $found = null;
        foreach ($messages as &$m) {
            if ($m['id'] === $id) {
                $m['active'] = !($m['active'] ?? true);
                $found = $m;
                break;
            }
        }
        unset($m);
        if ($found) {
            write_json_data('messages', $messages);
            echo json_encode(['status' => 'success', 'message' => $found], JSON_UNESCAPED_UNICODE);
            exit;
        }
    }

    if ($action === 'delete') {
        $messages = array_values(array_filter($messages, function($m) use ($id) {
            return $m['id'] !== $id;
        }));
        write_json_data('messages', $messages);
        echo json_encode(['status' => 'success', 'deletedId' => $id], JSON_UNESCAPED_UNICODE);
        exit;
    }
}

echo json_encode(['status' => 'error', 'message' => 'Invalid request']);
?>