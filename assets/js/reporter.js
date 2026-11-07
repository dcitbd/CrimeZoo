/**
 * CRIMINAL ZOO - REPORTER AUTHENTICATION, SEPARATE LOGIN/REGISTER & DASHBOARD CONTROLLER
 * Features:
 * - Persistent authentication via localStorage and sessionStorage
 * - Dynamic universal navbar update across all pages showing reporter profile name
 * - Auto-redirect from login page if already logged in
 * - Audit logs & Email notification on Login & Registration
 */

// Helper to get logged-in reporter
function getLoggedInReporter() {
  try {
    const raw = localStorage.getItem("cz_logged_reporter") || sessionStorage.getItem("cz_logged_reporter");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

// Universal navbar updater across all pages
function updateUniversalReporterUI() {
  const rep = getLoggedInReporter();
  if (!rep) return;

  // 1. Top Header Actions Button
  document.querySelectorAll('.header-actions a[href*="reporter-login.html"]').forEach(btn => {
    btn.href = "./reporter-dashboard.html";
    btn.className = "btn btn-sm";
    btn.style.cssText = "background:linear-gradient(135deg, #10b981, #059669); color:#fff; border:none; font-weight:700; display:inline-flex; align-items:center; gap:0.4rem; padding:0.45rem 0.9rem; border-radius:8px;";
    btn.innerHTML = `<span style="font-size:1.05rem;">👤</span> <span>${rep.name}</span>`;
  });

  // 2. Sidebar and Header Nav Links
  document.querySelectorAll('a.nav-link[href*="reporter-login.html"]').forEach(link => {
    const isCurrent = window.location.pathname.includes("reporter-dashboard.html");
    link.href = "./reporter-dashboard.html";
    link.className = `nav-link ${isCurrent ? "active" : ""}`;
    link.style.color = "#34d399";
    link.style.fontWeight = "700";
    link.innerHTML = `👤 ${rep.name} (ড্যাশবোর্ড)`;
  });

  // 3. Mobile Bottom App Navigation
  document.querySelectorAll('a.bottom-nav-item[href*="reporter-login.html"]').forEach(link => {
    link.href = "./reporter-dashboard.html";
    const span = link.querySelector("span");
    if (span) {
      span.innerText = "প্রোফাইল";
      span.style.color = "#34d399";
      span.style.fontWeight = "700";
    }
  });

  // 4. Quick Logout button in footer or mobile drawer if present
  document.querySelectorAll('.footer-bottom a[href*="reporter-login.html"]').forEach(link => {
    link.href = "./reporter-dashboard.html";
    link.innerText = `রিপোর্টার ডেস্ক (${rep.name})`;
  });
}

document.addEventListener("DOMContentLoaded", function () {
  updateUniversalReporterUI();
  initReporterPortal();
  checkLoginPageAutoRedirect();
});

function checkLoginPageAutoRedirect() {
  const isLoginPage = window.location.pathname.includes("reporter-login.html");
  if (!isLoginPage) return;

  const rep = getLoggedInReporter();
  if (!rep) return;

  const card = document.querySelector(".digital-auth-card");
  if (card) {
    const banner = document.createElement("div");
    banner.id = "alreadyLoggedInNotice";
    banner.style.cssText = "background:rgba(16,185,129,0.16); border:2px solid #10b981; border-radius:14px; padding:1.5rem; text-align:center; margin-bottom:1.5rem;";
    banner.innerHTML = `
      <div style="font-size:2.2rem; margin-bottom:0.4rem;">👤</div>
      <h3 style="color:#34d399; font-size:1.3rem; margin-top:0;">আপনি ইতিমধ্যে লগইন আছেন!</h3>
      <p style="color:#cbd5e1; font-size:0.92rem; margin:0.5rem 0 1.25rem 0; line-height:1.6;">
        বর্তমানে <strong>${rep.name}</strong> (ব্যাজ: ${rep.badgeNo} • জেলা: ${rep.district}) হিসেবে আপনার সেশন সক্রিয় রয়েছে।
      </p>
      <div style="display:flex; gap:0.75rem; justify-content:center; flex-wrap:wrap;">
        <a href="./reporter-dashboard.html" class="btn btn-primary" style="padding:0.75rem 1.6rem; font-weight:800; font-size:0.95rem;">
          📊 সরাসরি রিপোর্টার ড্যাশবোর্ডে প্রবেশ করুন →
        </a>
        <button type="button" onclick="reporterLogout()" class="btn btn-outline" style="padding:0.75rem 1.25rem;">
          🚪 লগআউট করে অন্য অ্যাকাউন্টে যান
        </button>
      </div>
    `;
    const form = card.querySelector("form");
    if (form) form.style.display = "none";
    const intro = card.querySelector("div[style*='text-align: center']");
    if (intro) intro.style.display = "none";
    card.insertBefore(banner, card.children[2] || null);
  }
}

function initReporterPortal() {
  const dashArea = document.getElementById("reporterDashboardArea");
  if (dashArea) {
    const rep = getLoggedInReporter();
    if (!rep) {
      window.location.replace("reporter-login.html");
      return;
    }

    const nameEl = document.getElementById("repProfileName");
    const badgeEl = document.getElementById("repProfileBadge");
    if (nameEl) nameEl.innerText = rep.name;
    if (badgeEl) {
      badgeEl.innerHTML = `
        <span>ব্যাজ: <strong>${rep.badgeNo}</strong></span> • 
        <span>জেলা: <strong>${rep.district}</strong></span> • 
        <span>মোবাইল: <strong>${rep.phone || 'N/A'}</strong></span> • 
        <span>ইমেইল: <strong>${rep.email || 'N/A'}</strong></span> • 
        <span>রোল: <strong>${rep.role === 'admin' ? 'এডমিন ও রিপোর্টার' : 'ভেরিফাইড রিপোর্টার'}</strong></span>
      `;
    }

    const distEl = document.getElementById("repProfileDistrict");
    const phoneEl = document.getElementById("repProfilePhone");
    const emailEl = document.getElementById("repProfileEmail");
    const orgEl = document.getElementById("repProfileOrg");
    if (distEl) distEl.innerText = rep.district || "ঢাকা";
    if (phoneEl) phoneEl.innerText = rep.phone || "গোপনীয়";
    if (emailEl) emailEl.innerText = rep.email || "N/A";
    if (orgEl) orgEl.innerText = rep.org || "সিটিজেন জার্নালিস্ট";
    renderReporterSubmissions(rep);
    window.addEventListener("storage", () => renderReporterSubmissions(rep));
    window.addEventListener("cz_data_updated", () => renderReporterSubmissions(rep));
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
    (r.email.toLowerCase() === email.toLowerCase() || r.phone === email || (r.id && r.id.toLowerCase() === email.toLowerCase())) &&
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

    // Save in both localStorage and sessionStorage
    localStorage.setItem("cz_logged_reporter", JSON.stringify(found));
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
      `রিপোর্টার লগইন ব্যর্থ চেষ্টা: ${email || "অজ্ঞাত"}`,
      "LOGIN FAILED",
      "#ef4444",
      `ভুল ক্রেডেনশিয়াল দিয়ে রিপোর্টার প্যানেলে লগইন করার চেষ্টা করা হয়েছে।`,
      { "প্রদত্ত ইমেইল/ফোন": email || "ফাঁকা", "স্ট্যাটাস": "FAILED" }
    );

    if (msgBox) {
      msgBox.style.display = "block";
      msgBox.style.background = "rgba(220,38,38,0.18)";
      msgBox.style.borderColor = "#dc2626";
      msgBox.style.color = "#fca5a5";
      msgBox.innerText = "✕ ইমেইল, মোবাইল বা পাসওয়ার্ড সঠিক নয়! দয়া করে সঠিক তথ্য দিয়ে চেষ্টা করুন।";
    }
  }
};

window.handleReporterRegister = function () {
  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const phone = document.getElementById("regPhone").value.trim();
  const nid = document.getElementById("regNid").value.trim();
  const org = document.getElementById("regOrg").value.trim();
  const district = document.getElementById("regDistrict").value;
  const pass = document.getElementById("regPass").value.trim();

  const newRep = StorageManager.addReporter({
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

  localStorage.setItem("cz_logged_reporter", JSON.stringify(newRep));
  sessionStorage.setItem("cz_logged_reporter", JSON.stringify(newRep));

  const successBox = document.getElementById("repRegSuccessBox");
  if (successBox) {
    successBox.style.display = "block";
    successBox.innerHTML = `✓ অভিনন্দন <strong>${newRep.name}</strong>! আপনার রেজিস্ট্রেশন ও পাসওয়ার্ড সংরক্ষিত হয়েছে। ড্যাশবোর্ডে প্রবেশ করা হচ্ছে...`;
    setTimeout(() => {
      window.location.href = "reporter-dashboard.html";
    }, 1000);
  } else {
    window.location.href = "reporter-dashboard.html";
  }
};

window.reporterLogout = function () {
  const rep = getLoggedInReporter();
  if (rep) {
    StorageManager.addAuditLog("রিপোর্টার লগআউট", "REPORTER-PANEL", rep.name, "রিপোর্টার প্যানেল থেকে লগআউট করেছেন।", "SUCCESS", "REPORTER");
  }
  localStorage.removeItem("cz_logged_reporter");
  sessionStorage.removeItem("cz_logged_reporter");
  window.location.href = "reporter-login.html";
};

function renderReporterSubmissions(rep) {
  const tbody = document.getElementById("reporterPostsTable");
  if (!tbody) return;
  const allReports = StorageManager.getReports();
  const myReports = allReports.filter(r => r.reporterId === rep.id || r.reporterName === rep.name || r.reporterPhone === rep.phone);

  const totalCountEl = document.getElementById("repTotalCount");
  const verifiedCountEl = document.getElementById("repVerifiedCount");
  const totalViewsEl = document.getElementById("repTotalViews");

  if (totalCountEl) totalCountEl.innerText = myReports.length.toLocaleString("bn-BD");
  if (verifiedCountEl) verifiedCountEl.innerText = myReports.filter(r => r.approvalStatus === "approved").length.toLocaleString("bn-BD");
  const totalViews = myReports.reduce((acc, r) => acc + (r.views || 0), 0);
  if (totalViewsEl) totalViewsEl.innerText = totalViews.toLocaleString("bn-BD");

  if (myReports.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 2rem; color: var(--text-muted);">আপনি এখনো কোনো প্রতিবেদন দাখিল করেননি। নতুন অনুসন্ধানী প্রতিবেদন পাঠাতে উপরের '➕ নতুন প্রতিবেদন পাঠান' বাটনে ক্লিক করুন।</td></tr>`;
    return;
  }

  tbody.innerHTML = myReports.map(r => `
    <tr>
      <td>
        <strong>${r.id}</strong><br>
        <span style="font-size:0.78rem; color:#34d399; font-weight:700;">🔑 গোপন পিন: ${r.pin}</span>
      </td>
      <td>
        <div style="font-weight:700; color:#fff;">${r.title}</div>
        <div style="font-size:0.8rem; color:#94a3b8; margin-top:2px;">📍 ${r.location} • 📅 ${r.date} • 🎞️ ${(r.mediaUrls ? r.mediaUrls.length : 1)}টি ছবি</div>
      </td>
      <td>
        ${r.approvalStatus === 'approved' && r.active !== false
          ? '<span class="badge badge-verified">🌐 লাইভ (Approved)</span>'
          : '<span class="badge badge-investigating">⏳ এডমিন অনুমোদনের অপেক্ষায়</span>'}
      </td>
      <td>
        <span class="badge ${r.status === 'verified' ? 'badge-verified' : (r.status === 'fake' ? 'badge-fake' : 'badge-investigating')}">
          ${r.status === 'verified' ? '✓ ভেরিফাইড' : (r.status === 'fake' ? '✕ ভুয়া' : '⏳ তদন্তাধীন')} (${r.truthScore || 75}%)
        </span>
      </td>
      <td>${(r.views || 0).toLocaleString("bn-BD")}</td>
      <td>
        <a href="./track-report.html?id=${r.id}&pin=${r.pin}" class="btn btn-secondary btn-sm" style="font-size:0.75rem;">
          🔍 সত্যতা ট্র্যাকিং
        </a>
      </td>
    </tr>
  `).join("");
}

window.getLoggedInReporter = getLoggedInReporter;
window.updateUniversalReporterUI = updateUniversalReporterUI;
