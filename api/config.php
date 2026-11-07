<?php
/**
 * CRIMINAL ZOO - EMAIL & BACKEND CONFIGURATION
 * Compatible with cPanel, VPS, Apache, Nginx, and Localhost.
 */

// Admin Notification Recipients
define('ADMIN_EMAIL_1', 'jainal.dcitbd@gmail.com');
define('ADMIN_EMAIL_2', 'saiful05333@gmail.com');

// SMTP Settings (Optional - For guaranteed 100% Gmail Inbox Delivery on cPanel)
// To use Gmail: Set SMTP_ENABLED to true, SMTP_HOST to 'smtp.gmail.com', SMTP_USER to your gmail,
// and SMTP_PASS to your 16-character Google App Password.
define('SMTP_ENABLED', false);
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 465); // 465 (SSL) or 587 (TLS)
define('SMTP_USER', 'jainal.dcitbd@gmail.com');
define('SMTP_PASS', ''); // Insert Gmail App Password or cPanel Webmail Password here

// Database credentials (Optional - JSON flat-file storage works automatically)
define('DB_HOST', 'localhost');
define('DB_NAME', 'criminal_zoo_db');
define('DB_USER', 'criminal_user');
define('DB_PASS', 'CriminalPass2026!');
?>
