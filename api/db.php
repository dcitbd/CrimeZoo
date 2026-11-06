<?php
/**
 * CRIME WATCH BD - DATABASE CONNECTION & BACKEND CONFIG (OPTIONAL FOR CPANEL)
 * If running on cPanel with MySQL, configure your credentials below.
 * On static hosting (GitHub Pages / Cloudflare Pages), the frontend runs entirely in-browser!
 */
header('Content-Type: application/json; charset=utf-8');

$host = 'localhost';
$db   = 'crime_portal_db';
$user = 'crime_user';
$pass = 'CrimePass2026!';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    // $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    // Fallback gracefully to JSON file or client-side storage
}
?>