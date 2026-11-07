<?php
/**
 * CRIMINAL ZOO - REPORTS REST API ENDPOINT
 * Handles real-time report retrieval, approval, updates, active/deactive toggles, and deletion.
 */
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/send-mail.php';

$reports = read_json_data('reports', []);

// GET: Returns reports
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $onlyPublic = isset($_GET['public']) && $_GET['public'] == '1';
    
    if ($onlyPublic) {
        $filtered = array_values(array_filter($reports, function ($r) {
            $isApproved = isset($r['approvalStatus']) && $r['approvalStatus'] === 'approved';
            $isActive = !isset($r['active']) || $r['active'] !== false;
            return $isApproved && $isActive;
        }));
        echo json_encode([
            "status" => "success",
            "count" => count($filtered),
            "reports" => $filtered
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    echo json_encode([
        "status" => "success",
        "count" => count($reports),
        "reports" => array_values($reports)
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// POST: Actions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input');
    $payload = json_decode($raw, true);
    if (!$payload) {
        $payload = $_POST;
    }

    $action = isset($payload['action']) ? $payload['action'] : '';

    // 1. CREATE / ADD REPORT
    if ($action === 'create' || isset($payload['newReport'])) {
        $item = isset($payload['newReport']) ? $payload['newReport'] : $payload;
        if (!isset($item['id'])) {
            $item['id'] = 'CZ-2026-' . rand(1000, 9999);
        }
        if (!isset($item['pin'])) {
            $item['pin'] = (string)rand(1000, 9999);
        }
        if (!isset($item['approvalStatus'])) {
            $item['approvalStatus'] = ($item['reporterType'] ?? '') === 'official' ? 'approved' : 'pending';
        }
        if (!isset($item['active'])) {
            $item['active'] = true;
        }

        array_unshift($reports, $item);
        write_json_data('reports', $reports);

        log_system_audit("নতুন রিপোর্ট দাখিল (API)", $item['id'], $item['reporterName'] ?? 'Visitor', "শিরোনাম: " . ($item['title'] ?? 'N/A'), "SUCCESS", "USER");

        // Email trigger
        $eventTitle = "নতুন অপরাধ প্রতিবেদন জমা হয়েছে ({$item['id']})";
        $summary = "Criminal Zoo পোর্টালে একটি নতুন প্রতিবেদন দাখিল করা হয়েছে। " . ($item['approvalStatus'] === 'pending' ? "এডমিন প্যানেল থেকে এপ্রুভ করলেই এটি মূল ফিডে লাইভ হবে।" : "এটি সরাসরি লাইভ ফিডে প্রকাশিত হয়েছে।");
        $mailHtml = "
        <div style='background:#0a0e17; color:#f8fafc; padding:24px; font-family:sans-serif; border:1px solid #dc2626; border-radius:12px;'>
          <h2 style='color:#ef4444; margin-top:0;'>🛡️ Criminal Zoo — নতুন অপরাধ প্রতিবেদন</h2>
          <p><strong>কেস আইডি:</strong> {$item['id']} (পিন: {$item['pin']})</p>
          <p><strong>শিরোনাম:</strong> " . htmlspecialchars($item['title'] ?? '') . "</p>
          <p><strong>ক্যাটাগরি:</strong> " . htmlspecialchars($item['category'] ?? '') . " | <strong>স্থান:</strong> " . htmlspecialchars($item['location'] ?? '') . "</p>
          <p><strong>রিপোর্টার:</strong> " . htmlspecialchars($item['reporterName'] ?? '') . " (" . htmlspecialchars($item['reporterPhone'] ?? '') . ")</p>
          <p><strong>অনুমোদন স্ট্যাটাস:</strong> " . ($item['approvalStatus'] === 'approved' ? 'Approved (Live)' : 'Pending Admin Approval') . "</p>
          <p style='background:rgba(255,255,255,0.05); padding:12px; border-radius:8px;'><strong>বিবরণ:</strong> " . nl2br(htmlspecialchars($item['description'] ?? '')) . "</p>
        </div>";
        dispatch_notification_email($eventTitle, $mailHtml, 'NEW_REPORT', $item);

        echo json_encode(["status" => "success", "report" => $item], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // 2. APPROVE REPORT
    if ($action === 'approve') {
        $id = $payload['id'] ?? '';
        $found = null;
        foreach ($reports as &$r) {
            if ($r['id'] === $id) {
                $r['approvalStatus'] = 'approved';
                $r['active'] = true;
                $r['status'] = 'verified';
                $r['truthScore'] = 95;
                $r['statusNote'] = 'এডমিন কর্তৃক অনুমোদিত ও ভেরিফাইড হয়ে লাইভ ফিডে প্রকাশিত হয়েছে।';
                $found = $r;
                break;
            }
        }
        unset($r);

        if ($found) {
            write_json_data('reports', $reports);
            log_system_audit("পোস্ট অনুমোদন ও লাইভ", $id, "Admin", "কেস {$id} এডমিন প্যানেল হতে এপ্রুভ করে লাইভ ফিডে প্রকাশ করা হয়েছে।", "SUCCESS", "ADMIN");
            echo json_encode(["status" => "success", "report" => $found], JSON_UNESCAPED_UNICODE);
            exit;
        }
        echo json_encode(["status" => "error", "message" => "Report not found"], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // 3. TOGGLE ACTIVE / DEACTIVE
    if ($action === 'toggle_active') {
        $id = $payload['id'] ?? '';
        $found = null;
        foreach ($reports as &$r) {
            if ($r['id'] === $id) {
                $currentActive = !isset($r['active']) || $r['active'] !== false;
                $newActive = !$currentActive;
                $r['active'] = $newActive;
                $r['approvalStatus'] = $newActive ? 'approved' : 'deactive';
                $found = $r;
                break;
            }
        }
        unset($r);

        if ($found) {
            write_json_data('reports', $reports);
            log_system_audit("পোস্ট সক্রিয়তা পরিবর্তন", $id, "Admin", "কেস {$id} " . ($found['active'] ? 'লাইভ' : 'ডিএক্টিভ') . " করা হয়েছে।", "SUCCESS", "ADMIN");
            echo json_encode(["status" => "success", "report" => $found], JSON_UNESCAPED_UNICODE);
            exit;
        }
        echo json_encode(["status" => "error", "message" => "Report not found"], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // 4. UPDATE REPORT (Full edit or status update)
    if ($action === 'update') {
        $id = $payload['id'] ?? ($payload['report']['id'] ?? '');
        $fields = $payload['fields'] ?? ($payload['report'] ?? []);
        $found = null;

        foreach ($reports as &$r) {
            if ($r['id'] === $id) {
                foreach ($fields as $k => $v) {
                    if ($k !== 'id') {
                        $r[$k] = $v;
                    }
                }
                $found = $r;
                break;
            }
        }
        unset($r);

        if ($found) {
            write_json_data('reports', $reports);
            log_system_audit("পোস্ট এডিট / আপডেট", $id, "Admin", "কেস {$id} এর তথ্য বা স্ট্যাটাস হালনাগাদ করা হয়েছে।", "SUCCESS", "ADMIN");
            echo json_encode(["status" => "success", "report" => $found], JSON_UNESCAPED_UNICODE);
            exit;
        }
        echo json_encode(["status" => "error", "message" => "Report not found"], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // 5. DELETE REPORT
    if ($action === 'delete') {
        $id = $payload['id'] ?? '';
        $beforeCount = count($reports);
        $reports = array_values(array_filter($reports, function ($r) use ($id) {
            return $r['id'] !== $id;
        }));

        if (count($reports) < $beforeCount) {
            write_json_data('reports', $reports);
            log_system_audit("রিপোর্ট ডিলিট", $id, "Admin", "কেস {$id} স্থায়ীভাবে মুছে ফেলা হয়েছে।", "SUCCESS", "ADMIN");
            echo json_encode(["status" => "success", "deletedId" => $id], JSON_UNESCAPED_UNICODE);
            exit;
        }
        echo json_encode(["status" => "error", "message" => "Report not found"], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // 6. SYNC BATCH
    if ($action === 'sync') {
        $incoming = $payload['reports'] ?? [];
        if (is_array($incoming) && count($incoming) > 0) {
            $existingMap = [];
            foreach ($reports as $idx => $r) {
                if (isset($r['id'])) {
                    $existingMap[$r['id']] = $idx;
                }
            }
            foreach ($incoming as $item) {
                if (!isset($item['id'])) continue;
                if (isset($existingMap[$item['id']])) {
                    // Update if incoming timestamp is newer or specified
                    $currIdx = $existingMap[$item['id']];
                    $reports[$currIdx] = array_merge($reports[$currIdx], $item);
                } else {
                    array_unshift($reports, $item);
                }
            }
            write_json_data('reports', $reports);
        }
        echo json_encode(["status" => "success", "count" => count($reports), "reports" => array_values($reports)], JSON_UNESCAPED_UNICODE);
        exit;
    }
}

echo json_encode(["status" => "error", "message" => "Invalid request method or action"]);
?>
