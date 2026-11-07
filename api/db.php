<?php
/**
 * CRIMINAL ZOO - DATABASE CONNECTION & HYBRID STORAGE ENGINE
 * Compatible with cPanel, Apache, Nginx, XAMPP, and Local Development.
 * Automatically manages persistent JSON data files in api/data/ with optional MySQL support.
 */

// Global CORS & JSON headers
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Ensure data directory exists
function get_data_dir() {
    $dir = __DIR__ . '/data';
    if (!is_dir($dir)) {
        @mkdir($dir, 0777, true);
    }
    return $dir;
}

// Read JSON data helper
function read_json_data($fileKey, $default = []) {
    $path = get_data_dir() . '/' . $fileKey . '.json';
    if (file_exists($path)) {
        $content = @file_get_contents($path);
        if ($content !== false && trim($content) !== '') {
            $parsed = json_decode($content, true);
            if ($parsed !== null) {
                return $parsed;
            }
        }
    }
    return $default;
}

// Write JSON data helper (atomic with LOCK_EX)
function write_json_data($fileKey, $data) {
    $path = get_data_dir() . '/' . $fileKey . '.json';
    $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    return @file_put_contents($path, $json, LOCK_EX) !== false;
}

// Audit Logger
function log_system_audit($action, $target, $user, $detail, $status = "SUCCESS", $role = "SYSTEM") {
    $logs = read_json_data('audit', []);
    $newLog = [
        "id" => "LOG-" . (time() % 100000),
        "action" => $action,
        "target" => $target,
        "admin" => $user,
        "detail" => $detail,
        "status" => $status,
        "role" => $role,
        "time" => date("d M Y, H:i:s") . " (BDT)",
        "timestamp" => time()
    ];
    array_unshift($logs, $newLog);
    if (count($logs) > 250) {
        $logs = array_slice($logs, 0, 250);
    }
    write_json_data('audit', $logs);
    return $newLog;
}

// Optional MySQL PDO Connection for cPanel
$host = 'localhost';
$db   = 'criminal_zoo_db';
$user = 'criminal_user';
$pass = 'CriminalPass2026!';
$charset = 'utf8mb4';

$pdo = null;
try {
    // $pdo = new PDO("mysql:host=$host;dbname=$db;charset=$charset", $user, $pass, [
    //     PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    //     PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    // ]);
} catch (\Exception $e) {
    // Fallback smoothly to JSON flat files
}
?>
