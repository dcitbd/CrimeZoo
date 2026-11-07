<?php
/**
 * CRIMINAL ZOO - SUBMIT REPORT BACKEND ENDPOINT
 * Directly processes and persists public crime reports & whistleblower complaints.
 */
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/send-mail.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    if (!$data) {
        $data = $_POST;
    }

    if (!empty($data)) {
        if (!isset($data['id'])) {
            $data['id'] = 'CZ-2026-' . rand(1000, 9999);
        }
        if (!isset($data['pin'])) {
            $data['pin'] = (string)rand(1000, 9999);
        }
        if (!isset($data['approvalStatus'])) {
            $data['approvalStatus'] = ($data['reporterType'] ?? '') === 'official' ? 'approved' : 'pending';
        }
        if (!isset($data['active'])) {
            $data['active'] = true;
        }
        if (!isset($data['timestamp'])) {
            $data['timestamp'] = round(microtime(true) * 1000);
        }

        // 1. Prepend to reports database
        $reports = read_json_data('reports', []);
        array_unshift($reports, $data);
        write_json_data('reports', $reports);

        // 2. If submitted as direct admin complaint, also log into messages
        if (!empty($data['isDirectAdminComplaint']) || strpos($data['title'] ?? '', '[সরাসরি এডমিন অভিযোগ]') !== false) {
            $messages = read_json_data('messages', []);
            $msgEntry = [
                "id" => "DIR-" . rand(1000, 9999),
                "type" => "direct_admin",
                "reporterType" => $data['reporterType'] ?? 'anonymous',
                "name" => $data['reporterName'] ?? 'বেনামি হুইসেলব্লোয়ার',
                "phone" => $data['reporterPhone'] ?? 'গোপনীয়',
                "email" => $data['reporterEmail'] ?? 'এনক্রিপ্টেড ভল্ট',
                "category" => $data['category'] ?? 'সাধারণ অভিযোগ',
                "location" => $data['location'] ?? 'ঢাকা',
                "subject" => "🚨 [সরাসরি এডমিন অভিযোগ] " . ($data['title'] ?? 'নতুন অভিযোগ'),
                "message" => $data['description'] ?? '',
                "mediaAttached" => $data['evidence'] ?? 'ডকুমেন্টস সংরক্ষিত',
                "mediaUrls" => $data['mediaUrls'] ?? [],
                "videoUrl" => $data['videoUrl'] ?? '',
                "audioUrl" => $data['audioUrl'] ?? '',
                "pdfUrl" => $data['pdfUrl'] ?? '',
                "date" => $data['date'] ?? date("d M Y"),
                "status" => "pending",
                "active" => true,
                "publishedReportId" => $data['id']
            ];
            array_unshift($messages, $msgEntry);
            write_json_data('messages', $messages);
        }

        // 3. Log audit
        log_system_audit("নতুন রিপোর্ট সাবমিট", $data['id'], $data['reporterName'] ?? 'Visitor', "শিরোনাম: " . ($data['title'] ?? ''), "SUCCESS", "USER");

        // 4. Trigger Email Notification to Admin
        $eventTitle = "নতুন অপরাধ প্রতিবেদন দাখিল ({$data['id']})";
        $summary = "Criminal Zoo পোর্টালে একটি নতুন প্রতিবেদন জমা হয়েছে। " . ($data['approvalStatus'] === 'approved' ? "এটি সরাসরি লাইভ ফিডে প্রকাশিত হয়েছে।" : "এডমিন প্যানেল থেকে এপ্রুভ করলেই এটি মূল ফিডে লাইভ হবে।");
        $mailHtml = "
        <div style='background:#0a0e17; color:#f8fafc; padding:24px; font-family:sans-serif; border:1px solid #dc2626; border-radius:12px; max-width:640px;'>
          <h2 style='color:#ef4444; margin-top:0;'>🛡️ Criminal Zoo — নতুন অপরাধ প্রতিবেদন দাখিল</h2>
          <table width='100%' cellpadding='8' style='border-collapse:collapse; background:#0f172a; border-radius:8px;'>
            <tr><td style='color:#94a3b8; border-bottom:1px solid #1e293b;'>কেস আইডি:</td><td style='color:#f8fafc; font-weight:bold; border-bottom:1px solid #1e293b;'>{$data['id']} (পিন: {$data['pin']})</td></tr>
            <tr><td style='color:#94a3b8; border-bottom:1px solid #1e293b;'>শিরোনাম:</td><td style='color:#38bdf8; font-weight:bold; border-bottom:1px solid #1e293b;'>" . htmlspecialchars($data['title'] ?? '') . "</td></tr>
            <tr><td style='color:#94a3b8; border-bottom:1px solid #1e293b;'>ক্যাটাগরি:</td><td style='color:#f8fafc; border-bottom:1px solid #1e293b;'>" . htmlspecialchars($data['category'] ?? '') . "</td></tr>
            <tr><td style='color:#94a3b8; border-bottom:1px solid #1e293b;'>ঘটনাস্থল:</td><td style='color:#f8fafc; border-bottom:1px solid #1e293b;'>" . htmlspecialchars($data['location'] ?? '') . "</td></tr>
            <tr><td style='color:#94a3b8; border-bottom:1px solid #1e293b;'>রিপোর্টার:</td><td style='color:#34d399; border-bottom:1px solid #1e293b;'>" . htmlspecialchars($data['reporterName'] ?? 'বেনামি') . " (" . htmlspecialchars($data['reporterPhone'] ?? 'গোপনীয়') . ")</td></tr>
            <tr><td style='color:#94a3b8;'>অনুমোদন স্ট্যাটাস:</td><td style='color:#fbbf24; font-weight:bold;'>" . ($data['approvalStatus'] === 'approved' ? 'Approved (Live)' : 'Pending Admin Approval') . "</td></tr>
          </table>
          <div style='margin-top:16px; background:rgba(255,255,255,0.04); padding:14px; border-radius:8px;'>
            <strong style='color:#38bdf8;'>বিবরণ:</strong><br>
            <p style='color:#cbd5e1; line-height:1.6; margin-top:6px;'>" . nl2br(htmlspecialchars($data['description'] ?? '')) . "</p>
          </div>
          <div style='margin-top:16px; font-size:12px; color:#64748b;'>Criminal Zoo Automated Real-Time Dispatcher • Zero-Trace Encrypted</div>
        </div>";

        dispatch_notification_email($eventTitle, $mailHtml, 'NEW_REPORT', $data);

        echo json_encode([
            "status" => "success",
            "caseId" => $data['id'],
            "pin" => $data['pin'],
            "approvalStatus" => $data['approvalStatus'],
            "message" => "Report submitted successfully and saved to database."
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
}

echo json_encode(["status" => "error", "message" => "Invalid request method or payload"]);
?>
