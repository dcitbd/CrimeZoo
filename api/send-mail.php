<?php
/**
 * CRIMINAL ZOO - AUTOMATED HTML EMAIL NOTIFICATION DISPATCHER
 * Sends real-time rich HTML notifications to:
 * - jainal.dcitbd@gmail.com
 * - saiful05333@gmail.com
 * Supports: cPanel PHP mail(), Socket-based SMTP (Gmail/cPanel), and Real-time logging.
 */
require_once __DIR__ . '/db.php';
if (file_exists(__DIR__ . '/config.php')) {
    require_once __DIR__ . '/config.php';
}

$DEFAULT_RECIPIENTS = [
    defined('ADMIN_EMAIL_1') ? ADMIN_EMAIL_1 : "jainal.dcitbd@gmail.com",
    defined('ADMIN_EMAIL_2') ? ADMIN_EMAIL_2 : "saiful05333@gmail.com"
];

// Socket SMTP Client Function (Pure PHP, zero external dependencies)
function send_via_socket_smtp($to, $subject, $htmlBody, $fromEmail) {
    if (!defined('SMTP_ENABLED') || !SMTP_ENABLED || !defined('SMTP_PASS') || empty(SMTP_PASS)) {
        return false;
    }

    $host = defined('SMTP_HOST') ? SMTP_HOST : 'smtp.gmail.com';
    $port = defined('SMTP_PORT') ? SMTP_PORT : 465;
    $user = defined('SMTP_USER') ? SMTP_USER : '';
    $pass = defined('SMTP_PASS') ? SMTP_PASS : '';

    $socketHost = ($port == 465) ? "ssl://{$host}" : $host;
    $socket = @fsockopen($socketHost, $port, $errno, $errstr, 12);
    if (!$socket) return false;

    $read = function() use ($socket) {
        $res = '';
        while ($str = fgets($socket, 515)) {
            $res .= $str;
            if (substr($str, 3, 1) == ' ') break;
        }
        return $res;
    };
    $write = function($cmd) use ($socket) {
        fputs($socket, $cmd . "\r\n");
    };

    $read();
    $write("EHLO " . ($_SERVER['SERVER_NAME'] ?? 'localhost'));
    $read();

    if ($port == 587) {
        $write("STARTTLS");
        $read();
        stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
        $write("EHLO " . ($_SERVER['SERVER_NAME'] ?? 'localhost'));
        $read();
    }

    $write("AUTH LOGIN");
    $read();
    $write(base64_encode($user));
    $read();
    $write(base64_encode($pass));
    $authRes = $read();
    if (strpos($authRes, '235') === false) {
        fclose($socket);
        return false;
    }

    $write("MAIL FROM: <{$user}>");
    $read();
    $write("RCPT TO: <{$to}>");
    $read();
    $write("DATA");
    $read();

    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: Criminal Zoo Security <{$user}>\r\n";
    $headers .= "To: <{$to}>\r\n";
    $headers .= "Subject: =?UTF-8?B?" . base64_encode($subject) . "?=\r\n";
    $headers .= "Date: " . date("r") . "\r\n";
    $headers .= "X-Mailer: CriminalZooEngine/4.0\r\n\r\n";

    $write($headers . $htmlBody . "\r\n.");
    $sendRes = $read();
    $write("QUIT");
    fclose($socket);

    return strpos($sendRes, '250') !== false;
}

function dispatch_notification_email($subject, $htmlBody, $eventType = 'SYSTEM_EVENT', $detailsObj = [], $customRecipients = null) {
    global $DEFAULT_RECIPIENTS;
    $recipients = $customRecipients ?: $DEFAULT_RECIPIENTS;

    // Detect server domain for valid RFC-compliant headers
    $host = !empty($_SERVER['SERVER_NAME']) ? $_SERVER['SERVER_NAME'] : (!empty($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : 'criminalzoo.org');
    $host = preg_replace('/^www\./', '', $host);
    $host = explode(':', $host)[0];
    if (empty($host) || $host === 'localhost' || filter_var($host, FILTER_VALIDATE_IP)) {
        $fromDomain = 'criminalzoo.org';
    } else {
        $fromDomain = $host;
    }

    $fromEmail = "no-reply@" . $fromDomain;
    $replyTo = "jainal.dcitbd@gmail.com";

    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: Criminal Zoo Security Alert <{$fromEmail}>\r\n";
    $headers .= "Reply-To: {$replyTo}\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
    $headers .= "X-Priority: 1 (Highest)\r\n";

    $results = [];
    $anySuccess = false;

    foreach ($recipients as $toEmail) {
        $sent = false;

        // 1. Try Socket SMTP if enabled
        if (defined('SMTP_ENABLED') && SMTP_ENABLED) {
            $sent = send_via_socket_smtp($toEmail, $subject, $htmlBody, $fromEmail);
        }

        // 2. Fallback to PHP native mail()
        if (!$sent && function_exists('mail')) {
            try {
                $sent = @mail($toEmail, $subject, $htmlBody, $headers, "-f " . $fromEmail);
                if (!$sent) {
                    $sent = @mail($toEmail, $subject, $htmlBody, $headers);
                }
            } catch (\Exception $e) {
                $sent = false;
            }
        }

        $results[$toEmail] = $sent;
        if ($sent) $anySuccess = true;
    }

    // Save in server-side sent emails log
    $logEntry = [
        "id" => "MAIL-" . rand(10000, 99999),
        "timestamp" => date("Y-m-d H:i:s"),
        "timeBn" => date("d M Y, h:i A"),
        "recipients" => $recipients,
        "eventType" => $eventType,
        "subject" => $subject,
        "details" => $detailsObj,
        "dispatchResults" => $results,
        "nativeMailSent" => $anySuccess,
        "html" => $htmlBody
    ];

    $mailLogs = read_json_data('mail_logs', []);
    array_unshift($mailLogs, $logEntry);
    if (count($mailLogs) > 100) {
        $mailLogs = array_slice($mailLogs, 0, 100);
    }
    write_json_data('mail_logs', $mailLogs);

    // Text file append for system admins
    $logLine = "[" . date("Y-m-d H:i:s") . "] [{$eventType}] Subject: {$subject} | Sent: " . ($anySuccess ? 'YES' : 'NO') . " | To: " . implode(', ', $recipients) . "\n";
    @file_put_contents(get_data_dir() . '/mail_dispatch.log', $logLine, FILE_APPEND | LOCK_EX);

    return [
        "status" => "success",
        "recipients" => $recipients,
        "dispatched" => true,
        "nativeMailSent" => $anySuccess,
        "results" => $results,
        "mailId" => $logEntry["id"]
    ];
}

// Handle HTTP requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input');
    $payload = json_decode($raw, true) ?: $_POST;

    $action = isset($payload['action']) ? $payload['action'] : '';

    if ($action === 'test_mail') {
        $testSubject = "[Criminal Zoo Test Alert] ইমেইল নোটিফিকেশন সিস্টেম টেস্ট ভেরিফিকেশন — " . date("H:i:s");
        $testHtml = "
        <div style='background:#0a0e17; color:#f8fafc; padding:25px; font-family:sans-serif; border:1px solid #10b981; border-radius:12px; max-width:600px;'>
          <h2 style='color:#34d399; margin-top:0;'>✓ Criminal Zoo ইমেইল নোটিফিকেশন সক্রিয়</h2>
          <p>এই টেস্ট ইমেইলটি সফলভাবে Criminal Zoo পোর্টাল হতে প্রেরিত হয়েছে। আপনার সার্ভার মেইল কনফিগারেশন সঠিক ও প্রস্তুত।</p>
          <p><strong>প্রাপক:</strong> jainal.dcitbd@gmail.com, saiful05333@gmail.com</p>
          <p><strong>সময়:</strong> " . date("Y-m-d H:i:s") . " (BDT)</p>
          <hr style='border:0; border-top:1px solid #1e293b; margin:20px 0;'>
          <small style='color:#94a3b8;'>Criminal Zoo Command Center • Automated Security & Real-Time Notification Engine</small>
        </div>";
        $res = dispatch_notification_email($testSubject, $testHtml, 'TEST_EMAIL', ["নোট" => "ম্যানুয়াল টেস্ট রিকোয়েস্ট"]);
        echo json_encode($res, JSON_UNESCAPED_UNICODE);
        exit;
    }

    $subject = isset($payload['subject']) ? $payload['subject'] : 'Criminal Zoo Security & Activity Notification';
    $htmlBody = isset($payload['html']) ? $payload['html'] : '<p>Activity recorded on Criminal Zoo Portal.</p>';
    $eventType = isset($payload['eventType']) ? $payload['eventType'] : 'SYSTEM_EVENT';
    $details = isset($payload['details']) ? $payload['details'] : [];
    $recipients = isset($payload['recipients']) && is_array($payload['recipients']) ? $payload['recipients'] : null;

    $res = dispatch_notification_email($subject, $htmlBody, $eventType, $details, $recipients);
    echo json_encode($res, JSON_UNESCAPED_UNICODE);
    exit;
}

// GET request: returns sent email logs for admin inspection
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $mailLogs = read_json_data('mail_logs', []);
    echo json_encode([
        "status" => "ready",
        "recipients" => $DEFAULT_RECIPIENTS,
        "logsCount" => count($mailLogs),
        "recentLogs" => array_slice($mailLogs, 0, 20)
    ], JSON_UNESCAPED_UNICODE);
    exit;
}
?>
