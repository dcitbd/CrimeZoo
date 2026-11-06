<?php
/**
 * CRIME ZOO - AUTOMATED HTML EMAIL NOTIFICATION DISPATCHER
 * Sends real-time rich HTML notifications to:
 * - jainal.dcitbd@gmail.com
 * - saiful05333@gmail.com
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$recipients = [
    "jainal.dcitbd@gmail.com",
    "saiful05333@gmail.com"
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input');
    $payload = json_decode($raw, true);

    if (!$payload) {
        echo json_encode(["status" => "error", "message" => "Invalid JSON payload"]);
        exit;
    }

    $subject = isset($payload['subject']) ? $payload['subject'] : 'Crime Zoo Security & Activity Notification';
    $htmlBody = isset($payload['html']) ? $payload['html'] : '<p>Activity recorded on Crime Zoo Portal.</p>';
    $eventType = isset($payload['eventType']) ? $payload['eventType'] : 'SYSTEM_EVENT';

    $to = implode(", ", $recipients);
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=UTF-8\r\n";
    $headers .= "From: Crime Zoo Security Alert <no-reply@crimezoo.org>\r\n";
    $headers .= "Reply-To: jainal.dcitbd@gmail.com\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    $sent = false;
    try {
        if (function_exists('mail')) {
            $sent = @mail($to, $subject, $htmlBody, $headers);
        }
    } catch (\Exception $e) {
        $sent = false;
    }

    // Also log to server-side mail log file if writable
    $logEntry = [
        "timestamp" => date("Y-m-d H:i:s"),
        "recipients" => $recipients,
        "eventType" => $eventType,
        "subject" => $subject,
        "mailSent" => $sent
    ];
    @file_put_contents(__DIR__ . '/mail_dispatch.log', json_encode($logEntry, JSON_UNESCAPED_UNICODE) . "\n", FILE_APPEND);

    echo json_encode([
        "status" => "success",
        "recipients" => $recipients,
        "dispatched" => true,
        "nativeMailSent" => $sent
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode(["status" => "ready", "recipients" => $recipients]);
?>
