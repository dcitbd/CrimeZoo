<?php
/**
 * GET ALL REPORTS API
 */
require_once __DIR__ . '/db.php';

// Returns sample or saved reports in JSON format
$dataFile = __DIR__ . '/reports.json';
if (file_exists($dataFile)) {
    echo file_get_contents($dataFile);
} else {
    echo json_encode(["status" => "success", "message" => "Database initialized"]);
}
?>