<?php
/**
 * CRIMINAL ZOO - ADMIN OPERATIONS BACKEND ENDPOINT
 * Handles post approvals, full updates, deletions, and official post additions.
 */
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/send-mail.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $raw = file_get_contents('php://input');
    $payload = json_decode($raw, true);
    if (!$payload) {
        $payload = $_POST;
    }

    $action = $payload['action'] ?? '';
    $reports = read_json_data('reports', []);

    // 1. APPROVE REPORT
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
            log_system_audit("পোস্ট অনুমোদন ও লাইভ", $id, "Admin", "কেস {$id} লাইভ করা হয়েছে।", "SUCCESS", "ADMIN");
            echo json_encode(["status" => "success", "updated" => true, "report" => $found], JSON_UNESCAPED_UNICODE);
            exit;
        }
        echo json_encode(["status" => "error", "message" => "Report not found"], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // 2. TOGGLE ACTIVE
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
            log_system_audit("পোস্ট স্ট্যাটাস টগল", $id, "Admin", "কেস {$id} " . ($found['active'] ? 'লাইভ' : 'ডিএক্টিভ') . " করা হয়েছে।", "SUCCESS", "ADMIN");
            echo json_encode(["status" => "success", "updated" => true, "report" => $found], JSON_UNESCAPED_UNICODE);
            exit;
        }
        echo json_encode(["status" => "error", "message" => "Report not found"], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // 3. FULL EDIT / UPDATE
    if ($action === 'update') {
        $id = $payload['id'] ?? ($payload['fields']['id'] ?? '');
        $fields = $payload['fields'] ?? [];
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
            log_system_audit("পোস্ট তথ্য এডিট", $id, "Admin", "কেস {$id} এর তথ্য সম্পূর্ণ আপডেট করা হয়েছে।", "SUCCESS", "ADMIN");
            echo json_encode(["status" => "success", "updated" => true, "report" => $found], JSON_UNESCAPED_UNICODE);
            exit;
        }
        echo json_encode(["status" => "error", "message" => "Report not found"], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // 4. DELETE REPORT
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

    // 5. ADD OFFICIAL POST DIRECTLY
    if ($action === 'create_official' || isset($payload['newReport'])) {
        $newReport = $payload['newReport'] ?? $payload;
        if (!isset($newReport['id'])) {
            $newReport['id'] = 'CZ-2026-' . rand(1000, 9999);
        }
        $newReport['approvalStatus'] = 'approved';
        $newReport['active'] = true;
        array_unshift($reports, $newReport);
        write_json_data('reports', $reports);
        log_system_audit("অফিশিয়াল পোস্ট তৈরি", $newReport['id'], "Admin", "শিরোনাম: " . ($newReport['title'] ?? ''), "SUCCESS", "ADMIN");
        echo json_encode(["status" => "success", "created" => true, "report" => $newReport], JSON_UNESCAPED_UNICODE);
        exit;
    }
}

echo json_encode(["status" => "unauthorized", "message" => "Invalid action or request"]);
?>
