/**
 * CRIME ZOO - SEPARATED REPORTER AUTHENTICATION & DASHBOARD CONTROLLER
 * All registrations stored with password in Admin Users list.
 * Dispatches mail alerts to jainal.dcitbd@gmail.com and saiful05333@gmail.com.
 */

document.addEventListener("DOMContentLoaded", function () {
  initReporterPortal();
});

function initReporterPortal() {
  const dashArea = document.getElementById("reporterDashboardArea");
  if (dashArea) {
    const repStr = sessionStorage.getItem("cz_logged_reporter");
    if (!repStr) {
      window.location.href = "reporter-login.html";
      return;
    }
    const rep = JSON.parse(repStr);
    document.getElementById("repProfileName").innerText = rep.name;
    document.getElementById("repProfileBadge").innerText = `ব্যাজ আইডি: ${rep.badgeNo} • জেলা: ${rep.district}`;
    renderReporterSubmissions(rep);
  }
}

window.handleReporterLogin = function () {
  const email = document.getElementById("repLoginEmail").value.trim();
  const pass = document.getElementById("repLoginPass").value.trim();
  const list = StorageManager.getReporters();
  const found = list.find(r => (r.email.toLowerCase() === email.toLowerCase() || r.phone === email) && r.pass === pass);

  if (found) {
    sessionStorage.setItem("cz_logged_reporter", JSON.stringify(found));
    
    // Send email alert on reporter login
    if (window.MailerService) {
      MailerService.sendNotification("REPORTER_LOGIN", `রিপোর্টার লগইন: ${found.name} (${found.badgeNo})`, {
        "রিপোর্টারের নাম": found.name,
        "ব্যাজ আইডি": found.badgeNo,
        "ইমেইল": found.email,
        "জেলা": found.district,
        "স্ট্যাটাস": "সফল লগইন"
      });
    }

    StorageManager.addAuditLog("রিপোর্টার লগইন", found.badgeNo, found.name, "রিপোর্টার পোর্টালে সফলভাবে প্রবেশ করেছেন।");
    window.location.href = "reporter-dashboard.html";
  } else {
    alert("ইমেইল/ফোন অথবা পাসওয়ার্ড সঠিক নয়!");
    StorageManager.addAuditLog("ব্যর্থ রিপোর্টার লগইন চেষ্টা", email, "Unknown Device", "ভুল পাসওয়ার্ড দিয়ে লগইন করার চেষ্টা।");
  }
};

window.handleReporterRegister = function () {
  const name = document.getElementById("repRegName").value.trim();
  const email = document.getElementById("repRegEmail").value.trim();
  const phone = document.getElementById("repRegPhone").value.trim();
  const district = document.getElementById("repRegDistrict").value.trim();
  const pass = document.getElementById("repRegPass").value.trim();

  const newRep = {
    id: "REP-" + Math.floor(200 + Math.random() * 799),
    name,
    email,
    phone,
    pass, // Saved with password for admin management
    district,
    badgeNo: "CZ-REP-2026-" + Math.floor(10 + Math.random() * 89),
    verifiedReports: 0,
    status: "ভেরিফাইড রিপোর্টার"
  };

  StorageManager.registerReporter(newRep);
  sessionStorage.setItem("cz_logged_reporter", JSON.stringify(newRep));

  // Send email alert with registration data
  if (window.MailerService) {
    MailerService.sendNotification("NEW_REPORTER_REGISTRATION", `নতুন রিপোর্টার রেজিস্ট্রেশন: ${name} (${district})`, {
      "রিপোর্টারের নাম": name,
      "ইমেইল": email,
      "ফোন": phone,
      "জেলা": district,
      "পাসওয়ার্ড": pass,
      "ব্যাজ আইডি": newRep.badgeNo,
      "অ্যাডমিন করণীয়": "ইউজার প্যানেলে সরাসরি সক্রিয় রয়েছে"
    });
  }

  StorageManager.addAuditLog("নতুন রিপোর্টার রেজিস্ট্রেশন", newRep.badgeNo, name, `জেলা: ${district}, ইমেইল: ${email}`);
  alert("আপনার রিপোর্টার রেজিস্ট্রেশন সফলভাবে সম্পন্ন হয়েছে!");
  window.location.href = "reporter-dashboard.html";
};

window.reporterLogout = function () {
  sessionStorage.removeItem("cz_logged_reporter");
  window.location.href = "reporter-login.html";
};

function renderReporterSubmissions(rep) {
  const tbody = document.getElementById("reporterPostsTable");
  if (!tbody) return;
  const allReports = StorageManager.getReports();
  const myReports = allReports.filter(r => r.reporterId === rep.id || r.reporterName === rep.name);

  document.getElementById("repTotalCount").innerText = myReports.length.toLocaleString("bn-BD");
  document.getElementById("repVerifiedCount").innerText = myReports.filter(r => r.status === "verified").length.toLocaleString("bn-BD");
  const totalViews = myReports.reduce((acc, r) => acc + (r.views || 0), 0);
  document.getElementById("repTotalViews").innerText = totalViews.toLocaleString("bn-BD");

  if (myReports.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 1.5rem; color: var(--text-muted);">আপনি এখনো কোনো প্রতিবেদন জমা দেননি।</td></tr>`;
    return;
  }

  tbody.innerHTML = myReports.map(r => `
    <tr>
      <td><strong>${r.id}</strong><br><span style="font-size:0.75rem; color:#34d399;">গোপন পিন: ${r.pin}</span></td>
      <td>
        <div style="font-weight:700; color:#fff;">${r.title}</div>
        <div style="font-size:0.8rem; color:#94a3b8;">📍 ${r.location} • 📅 ${r.date}</div>
      </td>
      <td><span class="badge ${r.status === 'verified' ? 'badge-verified' : 'badge-investigating'}">${r.status === 'verified' ? 'ভেরিফাইড' : 'তদন্তাধীন'}</span></td>
      <td>${(r.views || 0).toLocaleString("bn-BD")}</td>
      <td><a href="./track-report.html?id=${r.id}&pin=${r.pin}" class="btn btn-secondary btn-sm">ট্র্যাকিং দেখুন</a></td>
    </tr>
  `).join("");
}
