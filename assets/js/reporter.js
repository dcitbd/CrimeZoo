/**
 * CRIME ZOO - REPORTER AUTHENTICATION, SEPARATE LOGIN/REGISTER & DASHBOARD CONTROLLER
 * Features:
 * - Separate Login (reporter-login.html) & Register (reporter-register.html) handling
 * - Logs all Success and Failed login attempts to Security Audit Log (Requirement #17)
 * - Triggers Email Notification on Login & Registration to jainal.dcitbd@gmail.com, saiful05333@gmail.com (Requirement #18)
 * - Saves all registration fields including password to Admin Users list (Requirement #11 & #14)
 */

document.addEventListener("DOMContentLoaded", function () {
  initReporterPortal();
});

function initReporterPortal() {
  const dashArea = document.getElementById("reporterDashboardArea");
  if (dashArea) {
    const repStr = sessionStorage.getItem("cz_logged_reporter");
    if (!repStr) {
      window.location.replace("reporter-login.html");
      return;
    }
    const rep = JSON.parse(repStr);
    document.getElementById("repProfileName").innerText = rep.name;
    document.getElementById("repProfileBadge").innerText = `ব্যাজ আইডি: ${rep.badgeNo} • জেলা: ${rep.district} • রোল: ${rep.role === 'admin' ? 'এডমিন ও রিপোর্টার' : 'ভেরিফাইড রিপোর্টার'}`;
    renderReporterSubmissions(rep);

    window.addEventListener("storage", () => renderReporterSubmissions(rep));
  }
}

window.handleReporterLogin = function () {
  const emailInp = document.getElementById("repLoginEmail");
  const passInp = document.getElementById("repLoginPass");
  const msgBox = document.getElementById("repLoginStatusBox");
  const email = (emailInp ? emailInp.value : "").trim();
  const pass = (passInp ? passInp.value : "").trim();

  const list = StorageManager.getReporters();
  const found = list.find(r =>
    (r.email.toLowerCase() === email.toLowerCase() || r.phone === email || r.id.toLowerCase() === email.toLowerCase()) &&
    r.pass === pass
  );

  if (found) {
    if (found.active === false) {
      StorageManager.addAuditLog(
        "ডিএক্টিভ রিপোর্টার লগইন চেষ্টা (ব্যর্থ)",
        "REPORTER-LOGIN",
        `${found.name} (${email})`,
        "ডিএক্টিভকৃত অ্যাকাউন্ট দিয়ে লগইনের চেষ্টা করা হয়েছে — প্রবেশাধিকার ব্লকড।",
        "FAILED",
        "REPORTER"
      );
      EmailNotifier.send(
        "REPORTER_LOGIN_BLOCKED",
        `ডিএক্টিভ ইউজার লগইন চেষ্টা: ${found.name}`,
        "LOGIN BLOCKED",
        "#ef4444",
        `ডিএক্টিভকৃত ইউজার ${found.name} (${email}) রিপোর্টার প্যানেলে লগইনের চেষ্টা করেছেন।`,
        { "ইউজার": found.name, "ইমেইল/ফোন": email, "স্ট্যাটাস": "FAILED (Account Deactivated)" }
      );
      if (msgBox) {
        msgBox.style.display = "block";
        msgBox.style.background = "rgba(220,38,38,0.18)";
        msgBox.style.borderColor = "#dc2626";
        msgBox.style.color = "#fca5a5";
        msgBox.innerText = "🚫 আপনার অ্যাকাউন্টটি বর্তমানে এডমিন কর্তৃক ডিএক্টিভ (স্থগিত) রয়েছে।";
      }
      return;
    }

    sessionStorage.setItem("cz_logged_reporter", JSON.stringify(found));
    StorageManager.addAuditLog(
      "রিপোর্টার লগইন সফল",
      "REPORTER-LOGIN",
      `${found.name} (${found.id})`,
      `ইমেইল/ফোন: ${email} • জেলা: ${found.district} • সফলভাবে রিপোর্টার ড্যাশবোর্ডে প্রবেশ করেছেন।`,
      "SUCCESS",
      found.role === "admin" ? "ADMIN" : "REPORTER"
    );

    EmailNotifier.send(
      "REPORTER_LOGIN_SUCCESS",
      `রিপোর্টার প্যানেলে সফল লগইন: ${found.name}`,
      "REPORTER LOGIN",
      "#10b981",
      `${found.name} (${found.badgeNo}) এইমাত্র রিপোর্টার প্যানেলে সফলভাবে লগইন করেছেন।`,
      {
        "ইউজার আইডি": found.id,
        "নাম": found.name,
        "ইমেইল": found.email,
        "মোবাইল": found.phone,
        "জেলা": found.district,
        "লগইন স্ট্যাটাস": "SUCCESS"
      }
    );

    window.location.href = "reporter-dashboard.html";
  } else {
    StorageManager.addAuditLog(
      "রিপোর্টার লগইন ব্যর্থ (ভুল তথ্য)",
      "REPORTER-LOGIN",
      email || "Unknown User",
      `প্রদত্ত ইমেইল/ফোন (${email}) ও পাসওয়ার্ড মেলেনি।`,
      "FAILED",
      "REPORTER"
    );

    EmailNotifier.send(
      "REPORTER_LOGIN_FAILED",
      `রিপোর্টার প্যানেলে ব্যর্থ লগইন চেষ্টা (${email})`,
      "FAILED LOGIN",
      "#f59e0b",
      `রিপোর্টার লগইন পেজে ভুল ইমেইল বা পাসওয়ার্ড দিয়ে লগইনের চেষ্টা করা হয়েছে।`,
      {
        "প্রদত্ত ইমেইল/ফোন": email,
        "প্রদত্ত পাসওয়ার্ড": pass,
        "লগইন স্ট্যাটাস": "FAILED"
      }
    );

    if (msgBox) {
      msgBox.style.display = "block";
      msgBox.style.background = "rgba(220,38,38,0.18)";
      msgBox.style.borderColor = "#dc2626";
      msgBox.style.color = "#fca5a5";
      msgBox.innerText = "⚠️ ইমেইল/ফোন অথবা পাসওয়ার্ড সঠিক নয়! অনুগ্রহ করে পুনরায় যাচাই করুন।";
    }
  }
};

window.handleReporterRegister = function () {
  const name = (document.getElementById("repRegName")?.value || "").trim();
  const email = (document.getElementById("repRegEmail")?.value || "").trim();
  const phone = (document.getElementById("repRegPhone")?.value || "").trim();
  const nid = (document.getElementById("repRegNid")?.value || "").trim();
  const org = (document.getElementById("repRegOrg")?.value || "").trim();
  const district = (document.getElementById("repRegDistrict")?.value || "").trim();
  const pass = (document.getElementById("repRegPass")?.value || "").trim();

  const newRep = StorageManager.registerReporter({
    id: "REP-" + Math.floor(200 + Math.random() * 799),
    name,
    email,
    phone,
    nid: nid || "যাচাইকৃত",
    org: org || "সিটিজেন জার্নালিস্ট",
    district,
    pass,
    role: "reporter",
    badgeNo: "CZ-REP-2026-" + Math.floor(10 + Math.random() * 89),
    verifiedReports: 0,
    active: true,
    status: "ভেরিফাইড রিপোর্টার"
  });

  sessionStorage.setItem("cz_logged_reporter", JSON.stringify(newRep));

  const successBox = document.getElementById("repRegSuccessBox");
  if (successBox) {
    successBox.style.display = "block";
    successBox.innerHTML = `✓ অভিনন্দন <strong>${newRep.name}</strong>! আপনার রেজিস্ট্রেশন ও পাসওয়ার্ড এডমিন ডাটাবেজে সংরক্ষিত হয়েছে। ড্যাশবোর্ডে প্রবেশ করা হচ্ছে...`;
    setTimeout(() => {
      window.location.href = "reporter-dashboard.html";
    }, 1100);
  } else {
    window.location.href = "reporter-dashboard.html";
  }
};

window.reporterLogout = function () {
  const repRaw = sessionStorage.getItem("cz_logged_reporter");
  if (repRaw) {
    try {
      const rep = JSON.parse(repRaw);
      StorageManager.addAuditLog("রিপোর্টার লগআউট", "REPORTER-PANEL", rep.name, "রিপোর্টার প্যানেল থেকে লগআউট করেছেন।", "SUCCESS", "REPORTER");
    } catch (e) {}
  }
  sessionStorage.removeItem("cz_logged_reporter");
  window.location.href = "reporter-login.html";
};

function renderReporterSubmissions(rep) {
  const tbody = document.getElementById("reporterPostsTable");
  if (!tbody) return;
  const allReports = StorageManager.getReports();
  const myReports = allReports.filter(r => r.reporterId === rep.id || r.reporterName === rep.name);

  document.getElementById("repTotalCount").innerText = myReports.length.toLocaleString("bn-BD");
  document.getElementById("repVerifiedCount").innerText = myReports.filter(r => r.approvalStatus === "approved").length.toLocaleString("bn-BD");
  const totalViews = myReports.reduce((acc, r) => acc + (r.views || 0), 0);
  document.getElementById("repTotalViews").innerText = totalViews.toLocaleString("bn-BD");

  if (myReports.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 1.5rem; color: var(--text-muted);">আপনি এখনো কোনো প্রতিবেদন জমা দেননি।</td></tr>`;
    return;
  }

  tbody.innerHTML = myReports.map(r => `
    <tr>
      <td><strong>${r.id}</strong><br><span style="font-size:0.78rem; color:#34d399; font-weight:700;">🔑 গোপন পিন: ${r.pin}</span></td>
      <td>
        <div style="font-weight:700; color:#fff;">${r.title}</div>
        <div style="font-size:0.8rem; color:#94a3b8;">📍 ${r.location} • 📅 ${r.date} • 🎞️ ${(r.mediaUrls ? r.mediaUrls.length : 1)}টি ছবি</div>
      </td>
      <td>
        ${r.approvalStatus === 'approved'
          ? '<span class="badge badge-verified">🌐 লাইভ (Approved)</span>'
          : '<span class="badge badge-investigating">⏳ এডমিন অনুমোদনের অপেক্ষায়</span>'}
      </td>
      <td><span class="badge ${r.status === 'verified' ? 'badge-verified' : 'badge-investigating'}">${r.status === 'verified' ? 'ভেরিফাইড' : 'তদন্তাধীন'}</span></td>
      <td>${(r.views || 0).toLocaleString("bn-BD")}</td>
      <td><a href="./track-report.html?id=${r.id}&pin=${r.pin}" class="btn btn-secondary btn-sm">🔍 সত্যতা ট্র্যাকিং</a></td>
    </tr>
  `).join("");
}
