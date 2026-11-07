<?php
/**
 * CRIMINAL ZOO - CONTACT & INBOX REST API
 * Processes public contact messages, updates contacts directory, and syncs with admin inbox.
 */
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/send-mail.php';

 = read_json_data('contacts', []);
 = read_json_data('messages', []);

// GET: Returns contacts and messages
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $type = $_GET['type'] ?? 'all';
    if ($type === 'contacts') {
        echo json_encode(['status' => 'success', 'count' => count($contacts), 'contacts' => array_values($contacts)], JSON_UNESCAPED_UNICODE);
        exit;
    }
    if ($type === 'messages') {
        echo json_encode(['status' => 'success', 'count' => count($messages), 'messages' => array_values($messages)], JSON_UNESCAPED_UNICODE);
        exit;
    }
    echo json_encode([
        'status' => 'success',
        'contacts' => array_values($contacts),
        'messages' => array_values($messages)
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// POST: Actions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input');
    $payload = json_decode($raw, true) ?: $_POST;

    $action = $payload['action'] ?? 'submit_contact';

    // 1. SUBMIT CONTACT FORM MESSAGE
    if ($action === 'submit_contact' || isset($payload['message']) || isset($payload['name'])) {
        $msgId = $payload['id'] ?? ('MSG-' . rand(1000, 9999));
        $cntId = 'CNT-' . rand(100, 999);
        $name = trim($payload['name'] ?? 'বেনামি প্রেরক');
        $phone = trim($payload['phone'] ?? 'গোপনীয়');
        $email = trim($payload['email'] ?? 'N/A');
        $category = $payload['category'] ?? 'সাধারণ যোগাযোগ';
        $location = $payload['location'] ?? 'ঢাকা';
        $subject = $payload['subject'] ?? 'নতুন বার্তা';
        $messageText = $payload['message'] ?? '';
        $mediaAttached = $payload['mediaAttached'] ?? 'টেক্সট বার্তা';
        $date = $payload['date'] ?? date('d M Y');

        // Save Message in messages.json
        $newMsg = [
            'id' => $msgId,
            'type' => $payload['type'] ?? 'contact',
            'reporterType' => $payload['reporterType'] ?? 'identified',
            'name' => $name,
            'phone' => $phone,
            'email' => $email,
            'category' => $category,
            'location' => $location,
            'subject' => $subject,
            'message' => $messageText,
            'mediaAttached' => $mediaAttached,
            'mediaUrls' => $payload['mediaUrls'] ?? [],
            'videoUrl' => $payload['videoUrl'] ?? '',
            'audioUrl' => $payload['audioUrl'] ?? '',
            'pdfUrl' => $payload['pdfUrl'] ?? '',
            'date' => $date,
            'status' => 'unread',
            'active' => true
        ];
        array_unshift($messages, $newMsg);
        write_json_data('messages', $messages);

        // Also Save into Contacts Directory so admin/contacts.html sees it instantly!
        $newContact = [
            'id' => $cntId,
            'name' => $name,
            'role' => $subject,
            'category' => $category,
            'phone' => $phone,
            'email' => $email,
            'district' => $location,
            'source' => 'user_form',
            'status' => 'active',
            'note' => $messageText,
            'date' => $date
        ];
        array_unshift($contacts, $newContact);
        write_json_data('contacts', $contacts);

        // Log audit
        log_system_audit('নতুন যোগাযোগ বার্তা', $msgId, $name, "বিষয়: {$subject} | মোবাইল: {$phone}", 'SUCCESS', 'USER');

        // Trigger Email Notification
        $eventTitle = "নতুন যোগাযোগ বার্তা জমা হয়েছে ({$name})";
        $summary = "Criminal Zoo যোগাযোগ ফর্ম হতে একটি নতুন বার্তা ও কন্টাক্ট ইনফো জমা হয়েছে।";
        $mailHtml = "
        <div style='background:#0a0e17; color:#f8fafc; padding:24px; font-family:sans-serif; border:1px solid #10b981; border-radius:12px; max-width:640px;'>
          <h2 style='color:#34d399; margin-top:0;'>📩 Criminal Zoo — নতুন যোগাযোগ বার্তা</h2>
          <table width='100%' cellpadding='8' style='border-collapse:collapse; background:#0f172a; border-radius:8px;'>
            <tr><td style='color:#94a3b8; border-bottom:1px solid #1e293b;'>প্রেরকের নাম:</td><td style='color:#f8fafc; font-weight:bold; border-bottom:1px solid #1e293b;'>{$name}</td></tr>
            <tr><td style='color:#94a3b8; border-bottom:1px solid #1e293b;'>মোবাইল / হোয়াটসঅ্যাপ:</td><td style='color:#38bdf8; font-weight:bold; border-bottom:1px solid #1e293b;'>{$phone}</td></tr>
            <tr><td style='color:#94a3b8; border-bottom:1px solid #1e293b;'>ইমেইল:</td><td style='color:#f8fafc; border-bottom:1px solid #1e293b;'>{$email}</td></tr>
            <tr><td style='color:#94a3b8; border-bottom:1px solid #1e293b;'>বিভাগ / জেলা:</td><td style='color:#f8fafc; border-bottom:1px solid #1e293b;'>{$category} • {$location}</td></tr>
            <tr><td style='color:#94a3b8; border-bottom:1px solid #1e293b;'>বিষয়:</td><td style='color:#fbbf24; font-weight:bold; border-bottom:1px solid #1e293b;'>{$subject}</td></tr>
            <tr><td style='color:#94a3b8;'>সংযুক্ত ফাইল:</td><td style='color:#a855f7;'>{$mediaAttached}</td></tr>
          </table>
          <div style='margin-top:16px; background:rgba(255,255,255,0.04); padding:14px; border-radius:8px;'>
            <strong style='color:#34d399;'>বার্তার বিবরণ:</strong><br>
            <p style='color:#cbd5e1; line-height:1.6; margin-top:6px;'>" . nl2br(htmlspecialchars($messageText)) . "</p>
          </div>
          <div style='margin-top:16px; font-size:12px; color:#64748b;'>Criminal Zoo Notification Engine • Zero-Trace Encrypted</div>
        </div>";

        dispatch_notification_email($eventTitle, $mailHtml, 'CONTACT_MESSAGE', $newMsg);

        echo json_encode([
            'status' => 'success',
            'messageId' => $msgId,
            'contactId' => $cntId,
            'message' => 'Contact submitted and synced successfully.'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // 2. ADMIN CONTACT CRUD
    if ($action === 'add_contact') {
        $item = $payload['contact'] ?? $payload;
        if (!isset($item['id'])) $item['id'] = 'CNT-' . rand(100, 999);
        array_unshift($contacts, $item);
        write_json_data('contacts', $contacts);
        log_system_audit('কন্টাক্ট তৈরি', $item['id'], 'Admin', 'নাম: ' . ($item['name'] ?? ''), 'SUCCESS', 'ADMIN');
        echo json_encode(['status' => 'success', 'contact' => $item], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($action === 'update_contact') {
        $id = $payload['id'] ?? '';
        $fields = $payload['fields'] ?? [];
        $found = null;
        foreach ($contacts as &$c) {
            if ($c['id'] === $id) {
                foreach ($fields as $k => $v) $c[$k] = $v;
                $found = $c;
                break;
            }
        }
        unset($c);
        if ($found) {
            write_json_data('contacts', $contacts);
            log_system_audit('কন্টাক্ট আপডেট', $id, 'Admin', 'নাম: ' . ($found['name'] ?? ''), 'SUCCESS', 'ADMIN');
            echo json_encode(['status' => 'success', 'contact' => $found], JSON_UNESCAPED_UNICODE);
            exit;
        }
        echo json_encode(['status' => 'error', 'message' => 'Contact not found'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($action === 'delete_contact') {
        $id = $payload['id'] ?? '';
        $contacts = array_values(array_filter($contacts, function ($c) use ($id) {
            return $c['id'] !== $id;
        }));
        write_json_data('contacts', $contacts);
        log_system_audit('কন্টাক্ট ডিলিট', $id, 'Admin', "কন্টাক্ট আইডি: {$id}", 'SUCCESS', 'ADMIN');
        echo json_encode(['status' => 'success', 'deletedId' => $id], JSON_UNESCAPED_UNICODE);
        exit;
    }
}

echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
?>