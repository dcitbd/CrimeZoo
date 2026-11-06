<?php
/**
 * ADMIN STATUS UPDATE ENDPOINT
 */
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    echo json_encode(["status" => "success", "updated" => true]);
    exit;
}
echo json_encode(["status" => "unauthorized"]);
?>