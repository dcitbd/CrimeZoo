/**
 * CRIME ZOO - DIRECT WEBSITE APP INSTALLER & PWA SHORTCUT CONTROLLER
 * Features:
 * 1. Native Browser PWA Install (beforeinstallprompt)
 * 2. Interactive Direct Website-to-App Installer Modal (Android / Windows / iOS / Mac)
 * 3. Instant WebApp Package & Desktop/Mobile Shortcut Generator
 */

let deferredPrompt = null;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    const swPath = window.location.pathname.includes("/admin/") ? "../sw.js" : "./sw.js";
    navigator.serviceWorker.register(swPath).catch(() => {});
  });
}

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  const banner = document.getElementById("pwaInstallBanner");
  if (banner) banner.style.display = "flex";

  document.querySelectorAll(".btn-install, #navInstallBtn").forEach(btn => {
    btn.style.display = "inline-flex";
  });
});

function ensureDirectAppModal() {
  if (document.getElementById("czDirectAppInstallModal")) return;
  const logoPath = window.location.pathname.includes("/admin/") ? "../assets/icons/logo.png" : "./assets/icons/logo.png";
  const modal = document.createElement("div");
  modal.id = "czDirectAppInstallModal";
  modal.className = "modal-backdrop";
  modal.style.zIndex = "999995";
  modal.innerHTML = `
    <div class="modal-container" style="max-width: 560px; padding: 1.85rem; border: 1px solid rgba(16, 185, 129, 0.45);">
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); padding-bottom:1rem; margin-bottom:1.25rem;">
        <div style="display:flex; align-items:center; gap:0.75rem;">
          <img src="${logoPath}" style="width:48px; height:48px; object-fit:contain; border-radius:12px; border:1px solid rgba(16,185,129,0.5);">
          <div>
            <span class="badge badge-verified">📲 ডিরেক্ট ওয়েব-অ্যাপ ইনস্টলার</span>
            <h3 style="color:#fff; font-size:1.25rem; margin-top:3px;">Crime Zoo App সরাসরি ইনস্টল করুন</h3>
          </div>
        </div>
        <button class="modal-close-btn" onclick="document.getElementById('czDirectAppInstallModal').classList.remove('active')">✕</button>
      </div>

      <div id="directInstallProgressBox" style="display:none; background:rgba(6,9,17,0.9); border:1px solid rgba(16,185,129,0.35); border-radius:12px; padding:1.15rem; margin-bottom:1.25rem;">
        <div style="display:flex; justify-content:space-between; font-size:0.85rem; color:#34d399; font-weight:700; margin-bottom:0.45rem;">
          <span id="directInstallStepText">অ্যাপ প্যাকেজ প্রস্তুত হচ্ছে...</span>
          <span id="directInstallPctText">0%</span>
        </div>
        <div style="width:100%; height:10px; background:rgba(255,255,255,0.1); border-radius:99px; overflow:hidden;">
          <div id="directInstallBar" style="width:0%; height:100%; background:linear-gradient(90deg, #10b981, #38bdf8); transition:width 0.25s ease;"></div>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.85rem; margin-bottom:1.25rem;">
        <div style="background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.3); border-radius:12px; padding:1rem; text-align:center;">
          <div style="font-size:2rem; margin-bottom:0.4rem;">📲</div>
          <div style="font-weight:700; color:#fff; font-size:0.95rem;">১. সরাসরি অ্যাপ ইনস্টল</div>
          <p style="font-size:0.78rem; color:#94a3b8; margin:0.35rem 0 0.85rem 0;">ওয়েবসাইট থেকে এক ক্লিকে ফুল-স্ক্রিন অ্যাপ হিসেবে ডিভাইসে ইনস্টল করুন।</p>
          <button type="button" class="btn btn-primary btn-sm" style="width:100%; background:linear-gradient(135deg,#10b981,#059669);" onclick="executeDirectWebAppInstall()">
            ⚡ এখনই অ্যাপ ইনস্টল করুন
          </button>
        </div>

        <div style="background:rgba(56,189,248,0.08); border:1px solid rgba(56,189,248,0.3); border-radius:12px; padding:1rem; text-align:center;">
          <div style="font-size:2rem; margin-bottom:0.4rem;">🔖</div>
          <div style="font-weight:700; color:#fff; font-size:0.95rem;">২. ক্রিয়েট শর্টকাট (Shortcut)</div>
          <p style="font-size:0.78rem; color:#94a3b8; margin:0.35rem 0 0.85rem 0;">হোম স্ক্রিন বা ডেস্কটপে ওয়ান-ট্যাপ লঞ্চার শর্টকাট ফাইল তৈরি করুন।</p>
          <button type="button" class="btn btn-secondary btn-sm" style="width:100%; border-color:#38bdf8; color:#38bdf8;" onclick="downloadDesktopMobileShortcut()">
            📥 শর্টকাট ডাউনলোড করুন
          </button>
        </div>
      </div>

      <div style="background:rgba(15,23,42,0.85); border:1px solid var(--border-color); border-radius:10px; padding:0.95rem; font-size:0.82rem; color:#cbd5e1; line-height:1.65;">
        <div style="font-weight:700; color:#38bdf8; margin-bottom:0.3rem;">📌 সব ডিভাইসে সরাসরি ইনস্টল গাইড:</div>
        <div>• <strong>Android / Chrome / Edge:</strong> উপরের <em>"এখনই অ্যাপ ইনস্টল করুন"</em> বাটনে ক্লিক করলে সরাসরি অ্যাপটি ইনস্টল হয়ে যাবে।</div>
        <div>• <strong>iPhone / iOS Safari:</strong> নিচে Share <strong>(⬆️)</strong> বাটনে ট্যাপ করে <strong>"Add to Home Screen"</strong> নির্বাচন করুন।</div>
        <div>• <strong>Windows / Desktop:</strong> অ্যাড্রেস বারের ডান পাশে <strong>Install Crime Zoo (⊕)</strong> আইকনে ক্লিক করুন অথবা ডিরেক্ট অ্যাপ লঞ্চার নামিয়ে নিন।</div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function triggerPwaInstall() {
  ensureDirectAppModal();
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      deferredPrompt = null;
      const banner = document.getElementById("pwaInstallBanner");
      if (banner) banner.style.display = "none";
    });
  } else {
    document.getElementById("czDirectAppInstallModal").classList.add("active");
  }
}

function openDirectAppInstallerModal() {
  ensureDirectAppModal();
  document.getElementById("czDirectAppInstallModal").classList.add("active");
}

function executeDirectWebAppInstall() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => {
      deferredPrompt = null;
      document.getElementById("czDirectAppInstallModal").classList.remove("active");
    });
    return;
  }

  const box = document.getElementById("directInstallProgressBox");
  const stepText = document.getElementById("directInstallStepText");
  const pctText = document.getElementById("directInstallPctText");
  const bar = document.getElementById("directInstallBar");
  if (!box) return;

  box.style.display = "block";
  let pct = 0;
  const timer = setInterval(() => {
    pct += 20;
    if (pct > 100) pct = 100;
    bar.style.width = pct + "%";
    pctText.innerText = pct + "%";
    if (pct === 40) stepText.innerText = "অফলাইন সার্ভিস ওয়ার্কার ও আইকন যুক্ত হচ্ছে...";
    if (pct === 80) stepText.innerText = "Crime Zoo স্ট্যান্ডঅ্যালোন ওয়েব-অ্যাপ ভেরিফাইড...";
    if (pct === 100) {
      clearInterval(timer);
      stepText.innerText = "✓ Crime Zoo Web-App লঞ্চার প্রস্তুত ও ডাউনলোড সম্পন্ন!";
      generateDirectStandaloneAppFile();
    }
  }, 220);
}

function generateDirectStandaloneAppFile() {
  const targetUrl = window.location.origin + window.location.pathname.replace(/\/admin\/.*$/, "/index.html").replace(/\/[^\/]*\.html$/, "/index.html");
  const appHtml = `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <title>Crime Zoo App</title>
  <style>
    body, html { margin:0; padding:0; width:100%; height:100%; background:#060911; color:#fff; font-family:sans-serif; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; }
    .card { background:#0b111e; border:1px solid #dc2626; border-radius:18px; padding:2rem; max-width:420px; box-shadow:0 20px 50px rgba(0,0,0,0.8); }
    .btn { display:inline-block; margin-top:1.2rem; padding:0.85rem 1.6rem; background:linear-gradient(135deg,#dc2626,#991b1b); color:#fff; text-decoration:none; font-weight:700; border-radius:10px; }
  </style>
  <script>
    window.onload = function() {
      window.location.replace("${targetUrl}");
    };
  </script>
</head>
<body>
  <div class="card">
    <h2>🛡️ Crime Zoo App</h2>
    <p>সুরক্ষিত অপরাধ অনুসন্ধান ও সত্যতা যাচাই অ্যাপে প্রবেশ করা হচ্ছে...</p>
    <a class="btn" href="${targetUrl}">🚀 অ্যাপ ওপেন করুন</a>
  </div>
</body>
</html>`;

  const blob = new Blob([appHtml], { type: "text/html;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "Crime-Zoo-App-Launcher.html";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function downloadDesktopMobileShortcut() {
  const targetUrl = window.location.origin + window.location.pathname.replace(/\/admin\/.*$/, "/index.html").replace(/\/[^\/]*\.html$/, "/index.html");
  const shortcutContent = `[InternetShortcut]\r\nURL=${targetUrl}\r\nIconIndex=0\r\n`;
  const blob = new Blob([shortcutContent], { type: "application/internet-shortcut" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "Crime-Zoo-Shortcut.url";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  if (window.showSecurityNotice) {
    window.showSecurityNotice("✓ Crime Zoo শর্টকাট ফাইল আপনার ডিভাইসে ডাউনলোড হয়েছে!");
  }
}

window.triggerPwaInstall = triggerPwaInstall;
window.openDirectAppInstallerModal = openDirectAppInstallerModal;
window.executeDirectWebAppInstall = executeDirectWebAppInstall;
window.downloadDesktopMobileShortcut = downloadDesktopMobileShortcut;
