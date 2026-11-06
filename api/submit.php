<?php
/**
 * SUBMIT REPORT BACKEND ENDPOINT
 */
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if ($data) {
        // Save to file or DB
        echo json_encode(["status" => "success", "caseId" => $data['id'] ?? 'CR-2026-0000']);
        exit;
    }
}
echo json_encode(["status" => "error", "message" => "Invalid request"]);
?>