/**
 * CRIMINAL ZOO - ZERO-LEAK & ANTI-HACKING SECURITY ENGINE
 * Enforces:
 * 1. F12 / Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C / Ctrl+U (View Source & DevTools Blocker)
 * 2. Ctrl+P / window.print() / PrintScreen Blocker & Screen Blackout Curtain
 * 3. Anti-Copy, Anti-Cut, Anti-Right-Click, Anti-Media-Download
 * 4. Anti-Tracking & Zero-Fingerprinting Privacy Shield (Masks WebRTC IP, Geolocation, Device Info)
 * 5. Global Criminal Zoo Logo Watermark Overlay
 */

(function initCriminalZooSecurity() {
  // 1. Zero-Tracking & Anti-Fingerprinting Shield (Protects whistleblowers & viewers from IP/Location/Device tracking)
  try {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition = function () {
        console.warn("Criminal Zoo Privacy Shield: Geolocation tracking blocked.");
      };
      navigator.geolocation.watchPosition = function () {
        console.warn("Criminal Zoo Privacy Shield: Geolocation watch blocked.");
      };
    }
    // Mask WebRTC local IP leak vectors
    if (window.RTCPeerConnection) {
      window.RTCPeerConnection = function () {
        throw new Error("Criminal Zoo Privacy Shield: WebRTC IP tracking disabled.");
      };
    }
    // Override window.print() directly so no JS or button can trigger printing
    window.print = function () {
      showSecurityNotice("নিরাপত্তা নীতি: এই ওয়েবসাইটের কোনো পেজ বা ডকুমেন্ট প্রিন্ট করা সম্পূর্ণ নিষিদ্ধ।");
    };
  } catch (err) {}

  // 2. Inject Security Toast & Blackout Curtain
  document.addEventListener("DOMContentLoaded", function () {
    const toast = document.createElement("div");
    toast.className = "security-toast";
    toast.id = "czSecurityToast";
    toast.innerHTML = `<span style="font-size: 1.25rem;">🛡️</span> <span id="sec-toast-msg">Criminal Zoo সুরক্ষা: কপি, ডাউনলোড ও স্ক্রিনশট নিষিদ্ধ।</span>`;
    document.body.appendChild(toast);

    const curtain = document.createElement("div");
    curtain.className = "screenshot-curtain";
    curtain.id = "screenshotCurtain";
    curtain.innerHTML = `
      <div style="max-width: 520px;">
        <img src="${window.location.pathname.includes('/admin/') ? '../assets/icons/logo.png' : './assets/icons/logo.png'}" style="width: 90px; height: 90px; object-fit: contain; margin: 0 auto 1rem auto;">
        <div style="font-size: 1.45rem; color: #f87171; margin-bottom: 0.5rem;">🔒 Criminal Zoo হুইসেলব্লোয়ার ও কনটেন্ট সুরক্ষা সক্রিয়</div>
        <p style="font-size: 0.95rem; color: #cbd5e1; font-weight: 400;">স্ক্রিনশট গ্রহণ, প্রিন্ট করা বা সোর্স কোড পরিদর্শন সম্পূর্ণ সীমাবদ্ধ করা হয়েছে।</p>
      </div>
    `;
    document.body.appendChild(curtain);

    // Inject Global Criminal Zoo Watermark
    const watermark = document.createElement("div");
    watermark.className = "security-watermark-overlay";
    const anonToken = "ZERO-TRACE- NODE";
    watermark.innerHTML = `
      <div class="security-watermark-text" style="top: 16%; left: 10%;">CRIMINAL ZOO • PROTECTED EVIDENCE • ${anonToken}</div>
      <div class="security-watermark-text" style="top: 48%; left: 38%;">CRIMINAL ZOO • NO COPY / NO PRINT / NO DOWNLOAD</div>
      <div class="security-watermark-text" style="top: 82%; left: 18%;">CRIMINAL ZOO • ENCRYPTED WHISTLEBLOWER PORTAL</div>
    `;
    document.body.appendChild(watermark);

    // Lock all video/audio tags against downloading
    const lockMedia = () => {
      document.querySelectorAll("video, audio").forEach(m => {
        m.setAttribute("controlsList", "nodownload noplaybackrate");
        m.setAttribute("disablePictureInPicture", "true");
        m.oncontextmenu = (e) => e.preventDefault();
      });
    };
    lockMedia();
    setInterval(lockMedia, 2000);
  });

  let toastTimer = null;
  window.showSecurityNotice = function (msg) {
    const toast = document.getElementById("czSecurityToast");
    const msgEl = document.getElementById("sec-toast-msg");
    if (!toast || !msgEl) return;
    msgEl.innerText = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  };

  function triggerCurtain(reason) {
    const curtain = document.getElementById("screenshotCurtain");
    if (curtain) {
      curtain.classList.add("active");
      setTimeout(() => curtain.classList.remove("active"), 1600);
    }
    window.showSecurityNotice(reason);
  }

  // 3. Block Right-Click Everywhere
  document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
    window.showSecurityNotice("Criminal Zoo সুরক্ষা: রাইট-ক্লিক ও সেভ অপশন নিষ্ক্রিয় রয়েছে।");
    return false;
  });

  // 4. Block Copy, Cut & Drag
  document.addEventListener("copy", function (e) {
    e.preventDefault();
    if (e.clipboardData) {
      e.clipboardData.setData("text/plain", "Criminal Zoo Protected Content - Copying is strictly prohibited.");
    }
    window.showSecurityNotice("পোস্ট বা পেজের কোনো টেক্সট কপি করা নিষিদ্ধ।");
    return false;
  });

  document.addEventListener("cut", function (e) {
    e.preventDefault();
    window.showSecurityNotice("টেক্সট কাট করা নিষিদ্ধ।");
    return false;
  });

  document.addEventListener("dragstart", function (e) {
    e.preventDefault();
    return false;
  });

  // 5. Block F12, DevTools Shortcuts, View-Source, Save, Print & PrintScreen
  window.addEventListener("keydown", function (e) {
    const key = e.key || "";
    const code = e.keyCode || e.which;

    // F12 (123)
    if (key === "F12" || code === 123) {
      e.preventDefault();
      e.stopPropagation();
      triggerCurtain("নিরাপত্তা নীতি: F12 ও ডেভেলপার টুলস সম্পূর্ণ নিষ্ক্রিয় করা হয়েছে।");
      return false;
    }

    // Ctrl+Shift+I / J / C / K (DevTools / Inspector)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && ["I", "i", "J", "j", "C", "c", "K", "k"].includes(key)) {
      e.preventDefault();
      e.stopPropagation();
      triggerCurtain("নিরাপত্তা নীতি: সোর্স কোড ও ইন্সপেক্টর নিষিদ্ধ।");
      return false;
    }

    // Ctrl+U (View Source)
    if ((e.ctrlKey || e.metaKey) && (key === "u" || key === "U")) {
      e.preventDefault();
      e.stopPropagation();
      triggerCurtain("ব্যাকএন্ড ও সোর্স কোড পরিদর্শন নিষিদ্ধ।");
      return false;
    }

    // Ctrl+P (Print)
    if ((e.ctrlKey || e.metaKey) && (key === "p" || key === "P")) {
      e.preventDefault();
      e.stopPropagation();
      triggerCurtain("এই ওয়েবসাইটের কোনো অংশ প্রিন্ট করা সম্পূর্ণ নিষিদ্ধ।");
      return false;
    }

    // Ctrl+S (Save)
    if ((e.ctrlKey || e.metaKey) && (key === "s" || key === "S")) {
      e.preventDefault();
      e.stopPropagation();
      window.showSecurityNotice("ওয়েবপেজ বা মিডিয়া ফাইল ডাউনলোড/সেভ করা নিষিদ্ধ।");
      return false;
    }

    // Ctrl+C (Copy)
    if ((e.ctrlKey || e.metaKey) && (key === "c" || key === "C")) {
      e.preventDefault();
      window.showSecurityNotice("টেক্সট কপি করা নিষিদ্ধ।");
      return false;
    }

    // PrintScreen or Win+Shift+S (Snipping tool)
    if (key === "PrintScreen" || code === 44 || (e.metaKey && e.shiftKey && (key === "s" || key === "S"))) {
      e.preventDefault();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText("CRIMINAL ZOO PROTECTED - SCREENSHOT BLOCKED");
      }
      triggerCurtain("স্ক্রিনশট গ্রহণ প্রতিরোধ ব্যবস্থা সক্রিয় রয়েছে।");
      return false;
    }
  }, true);

  window.addEventListener("keyup", function (e) {
    if (e.key === "PrintScreen" || e.keyCode === 44) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText("");
      }
      triggerCurtain("স্ক্রিনশট ব্লক করা হয়েছে।");
    }
  });

  // BeforePrint event interceptor
  window.addEventListener("beforeprint", function (e) {
    document.body.style.display = "none";
    setTimeout(() => { document.body.style.display = ""; }, 1500);
  });
})();

// ==========================================================================
// CONSOLE BLOCKED & AI AGENT / SCRAPER DETERRENT
// ==========================================================================
(function blockConsoleAndScrapers() {
  try {
    // Disable console output completely in production
    const noop = () => {};
    ["log", "debug", "info", "warn", "error", "dir", "table", "trace"].forEach(fn => {
      window.console[fn] = noop;
    });

    // Detect DevTools open via debugger timing and trigger blackout curtain
    setInterval(() => {
      const start = performance.now();
      debugger;
      if (performance.now() - start > 100) {
        if (window.showSecurityNotice) {
          window.showSecurityNotice("সতর্কবার্তা: কনসোল বা ডিবাগার খোলা নিষিদ্ধ!");
        }
        const curtain = document.getElementById("screenshotCurtain");
        if (curtain) {
          curtain.classList.add("active");
          setTimeout(() => curtain.classList.remove("active"), 2000);
        }
      }
    }, 2000);
  } catch (e) {}
})();
