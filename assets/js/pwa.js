/**
 * CRIME ZOO - ADVANCED DIRECT APP INSTALL & PWA CONTROLLER
 * Supports:
 * 1. Native beforeinstallprompt
 * 2. In-App Direct Install Modal for all mobile/desktop browsers
 * 3. Standalone Application experience
 */

let deferredInstallPrompt = null;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("./sw.js")
      .then(reg => console.info("Crime Zoo SW active:", reg.scope))
      .catch(() => {});
  });
}

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;

  const banner = document.getElementById("pwaInstallBanner");
  if (banner) banner.style.display = "flex";

  const navBtns = document.querySelectorAll(".btn-install, #navInstallBtn");
  navBtns.forEach(btn => btn.style.display = "inline-flex");
});

window.triggerPwaInstall = function () {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    deferredInstallPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        if (window.showSecurityNotice) {
          window.showSecurityNotice("Crime Zoo অ্যাপ সফলভাবে ইনস্টল হচ্ছে...");
        }
      }
      deferredInstallPrompt = null;
    });
  } else {
    // Show In-App Direct Install Guide Modal
    openDirectAppInstallModal();
  }
};

function openDirectAppInstallModal() {
  let modal = document.getElementById("czAppInstallModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.className = "modal-backdrop";
    modal.id = "czAppInstallModal";
    modal.innerHTML = `
      <div class="modal-container" style="max-width: 480px; padding: 2rem; text-align: center;">
        <img src="${window.location.pathname.includes('/admin/') ? '../assets/icons/logo.png' : './assets/icons/logo.png'}" style="width: 72px; height: 72px; object-fit: contain; margin: 0 auto 1rem auto; border-radius: 14px;">
        <h3 style="color: #fff; font-size: 1.35rem; font-weight: 800; margin-bottom: 0.5rem;">Crime Zoo অ্যাপ ইনস্টল করুন</h3>
        <p style="color: #cbd5e1; font-size: 0.9rem; line-height: 1.6; margin-bottom: 1.35rem;">
          কোনো অ্যাপ স্টোর বা থার্ড পার্টি ছাড়াই আপনার ব্রাউজার থেকে সরাসরি ইনস্টল করে অ্যাপের মতো অফলাইন ব্রাউজিং সুবিধা উপভোগ করুন।
        </p>

        <div style="background: rgba(8, 12, 22, 0.85); border: 1px solid var(--border-color); border-radius: 12px; padding: 1rem; text-align: left; font-size: 0.86rem; color: #cbd5e1; margin-bottom: 1.5rem; line-height: 1.7;">
          <div style="font-weight: 700; color: #38bdf8; margin-bottom: 4px;">সরাসরি ইনস্টল করার ধাপ:</div>
          <div>১. ব্রাউজারের উপরে ডানদিকের <strong>থ্রি ডট মেন্যু (⋮)</strong> অথবা শেয়ার বাটনে চাপুন।</div>
          <div>২. <strong>"Install App"</strong> অথবা <strong>"Add to Home screen"</strong> নির্বাচন করুন।</div>
          <div>৩. "Install" চাপলে স্বয়ংক্রিয়ভাবে আপনার ফোনে অ্যাপ আইকন যুক্ত হয়ে যাবে।</div>
        </div>

        <div style="display: flex; gap: 0.75rem;">
          <button class="btn btn-outline" style="flex: 1;" onclick="document.getElementById('czAppInstallModal').classList.remove('active')">বন্ধ করুন</button>
          <button class="btn btn-primary" style="flex: 1;" onclick="document.getElementById('czAppInstallModal').classList.remove('active'); alert('আপনার ব্রাউজার মেন্যু থেকে Install App বাটনটি নির্বাচন করুন।');">ঠিক আছে</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
  modal.classList.add("active");
}

window.openDirectAppInstallModal = openDirectAppInstallModal;
