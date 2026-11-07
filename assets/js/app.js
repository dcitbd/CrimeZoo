/**
 * CRIMINAL ZOO - MAIN PORTAL & ALL REPORTS (50+ PER PAGE) CONTROLLER
 * Features:
 * - Shows ONLY Admin-Approved & Active reports dynamically (Requirement #19)
 * - Auto Slide View for uploaded images (5-10 photos carousel with play/pause, thumbnails & zoom) (Requirement #5)
 * - 50+ Posts on 1 Page in All Reports page (Requirement #7)
 * - Interactive Digital Counter Filters
 * - Truth Tracking restricted to logged-in Reporters (Requirement #6)
 */

document.addEventListener("DOMContentLoaded", function () {
  initLiveCounters();
  initTicker();
  renderFeed();
  initCategoryFilters();
  initSearch();
  initModalListeners();
  initMobileDrawer();

  // Dynamic real-time listener when Admin approves/edits/adds reports
  if (typeof BroadcastChannel !== "undefined") {
    const appChannel = new BroadcastChannel("criminal_zoo_channel");
    appChannel.onmessage = function (ev) {
      if (ev.data && ev.data.type === "reports") {
        initLiveCounters();
        initTicker();
        renderFeed();
      }
    };
  }
  window.addEventListener("storage", function () {
    initLiveCounters();
    initTicker();
    renderFeed();
  });
  window.addEventListener("cz_data_updated", function () {
    initLiveCounters();
    initTicker();
    renderFeed();
  });
});

let currentActiveFilter = "all";
let currentCounterFilter = "all";
let currentSearchQuery = "";
let currentPage = 1;

function getItemsPerPage() {
  const pageAttr = document.body.getAttribute("data-page-size");
  if (pageAttr) return parseInt(pageAttr, 10) || 60;
  const path = window.location.pathname;
  if (path.includes("all-reports.html") || path.includes("fact-check.html")) {
    return 60; // 50+ posts on 1 page!
  }
  return 12;
}

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
function toBnNumber(n) {
  return String(n).replace(/[0-9]/g, d => BN_DIGITS[d]);
}

function initMobileDrawer() {
  const btn = document.getElementById("mobileMenuBtn");
  const drawer = document.getElementById("mobileDrawer");
  const overlay = document.getElementById("mobileDrawerOverlay");
  const closeBtn = document.getElementById("mobileDrawerClose");

  if (!btn || !drawer || !overlay) return;
  const openDrawer = () => {
    drawer.classList.add("open");
    overlay.classList.add("open");
  };
  const closeDrawer = () => {
    drawer.classList.remove("open");
    overlay.classList.remove("open");
  };
  btn.addEventListener("click", openDrawer);
  overlay.addEventListener("click", closeDrawer);
  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
}

// 1. Digital Animated Counters + Interactive Counter Filtering
function initLiveCounters() {
  const reports = StorageManager.getPublicApprovedReports();
  const totalReports = reports.length;
  const verifiedCount = reports.filter(r => r.status === "verified").length;
  const anonCount = reports.filter(r => r.reporterType === "anonymous").length;
  const fakeCount = reports.filter(r => r.status === "fake").length;

  animateCounter("statTotal", totalReports);
  animateCounter("statVerified", verifiedCount);
  animateCounter("statAnonymous", anonCount);
  animateCounter("statFake", fakeCount);

  const bindCounterClick = (elemId, filterVal) => {
    const numEl = document.getElementById(elemId);
    const card = numEl ? numEl.closest(".stat-card") : null;
    if (card && !card.dataset.boundFilter) {
      card.dataset.boundFilter = "true";
      card.style.cursor = "pointer";
      card.title = "ক্লিক করে এই ক্যাটাগরির রিপোর্ট ফিল্টার করুন";
      card.addEventListener("click", () => {
        currentCounterFilter = (currentCounterFilter === filterVal && filterVal !== "all") ? "all" : filterVal;
        document.querySelectorAll(".hero-counter-section .stat-card").forEach(c => {
          c.style.outline = "none";
          c.style.boxShadow = "";
        });
        if (currentCounterFilter !== "all") {
          card.style.outline = "2px solid #38bdf8";
          card.style.boxShadow = "0 0 22px rgba(56, 189, 248, 0.35)";
        }
        currentPage = 1;
        renderFeed();
      });
    }
  };

  bindCounterClick("statTotal", "all");
  bindCounterClick("statVerified", "verified");
  bindCounterClick("statAnonymous", "anonymous");
  bindCounterClick("statFake", "fake");
}

function animateCounter(elemId, target) {
  const el = document.getElementById(elemId);
  if (!el) return;
  let current = 0;
  const step = Math.max(1, Math.ceil(target / 18));
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.innerText = toBnNumber(current);
  }, 25);
}

// 2. Alert Ticker
function initTicker() {
  const tickerEl = document.getElementById("tickerText");
  if (!tickerEl) return;
  const reports = StorageManager.getPublicApprovedReports();
  if (reports.length > 0) {
    tickerEl.innerHTML = reports.slice(0, 15)
      .map(r => `<span class="ticker-link" onclick="openQuickView('${r.id}')">🚨 [${r.location}] ${r.title} (${r.id})</span>`)
      .join(" &nbsp;&nbsp;•&nbsp;&nbsp; ");
  }
}

// 3. Render Feed with Pagination
function getFilteredReports() {
  let filtered = StorageManager.getPublicApprovedReports();

  if (currentCounterFilter === "verified") {
    filtered = filtered.filter(r => r.status === "verified");
  } else if (currentCounterFilter === "anonymous") {
    filtered = filtered.filter(r => r.reporterType === "anonymous");
  } else if (currentCounterFilter === "fake") {
    filtered = filtered.filter(r => r.status === "fake");
  }

  if (currentActiveFilter !== "all") {
    filtered = filtered.filter(r => r.category === currentActiveFilter);
  }

  if (currentSearchQuery.trim() !== "") {
    const q = currentSearchQuery.toLowerCase();
    filtered = filtered.filter(r =>
      (r.title && r.title.toLowerCase().includes(q)) ||
      (r.location && r.location.toLowerCase().includes(q)) ||
      (r.category && r.category.toLowerCase().includes(q)) ||
      (r.description && r.description.toLowerCase().includes(q)) ||
      (r.id && r.id.toLowerCase().includes(q))
    );
  }
  return filtered;
}

function renderFeed() {
  const feedGrid = document.getElementById("feedGrid");
  if (!feedGrid) return;

  const itemsPerPage = getItemsPerPage();
  const filtered = getFilteredReports();
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  const startIdx = (currentPage - 1) * itemsPerPage;
  const pageItems = filtered.slice(startIdx, startIdx + itemsPerPage);

  const countBanner = document.getElementById("allReportsCountLabel");
  if (countBanner) {
    countBanner.innerText = `মোট প্রকাশিত লাইভ রিপোর্ট: ${toBnNumber(totalItems)} টি (এক পেজে ${toBnNumber(pageItems.length)} টি প্রদর্শিত হচ্ছে)`;
  }

  if (pageItems.length === 0) {
    feedGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3.5rem 1rem; color: var(--text-muted); background: var(--bg-card); border-radius: 16px; border: 1px solid var(--border-color);">
        <div style="font-size: 2.8rem; margin-bottom: 0.75rem;">🔍</div>
        <h3 style="color: #fff;">কোনো অনুসন্ধানী প্রতিবেদন পাওয়া যায়নি</h3>
        <p style="margin-top: 0.4rem;">অন্য কোনো কী-ওয়ার্ড বা ক্যাটাগরি নির্বাচন করুন।</p>
      </div>
    `;
    renderPaginationBar(0, 1);
    return;
  }

  feedGrid.innerHTML = pageItems.map(r => createPostCardHTML(r)).join("");
  renderPaginationBar(totalItems, totalPages);
}

function renderPaginationBar(totalItems, totalPages) {
  const pagEl = document.getElementById("paginationBar");
  if (!pagEl) return;

  if (totalItems === 0) {
    pagEl.innerHTML = "";
    return;
  }

  const displayPages = Math.max(totalPages, 1);
  let html = `<button class="page-btn" ${currentPage === 1 ? "disabled" : ""} onclick="goToPage(${currentPage - 1})">&lt; পূর্ববর্তী</button>`;

  for (let p = 1; p <= displayPages; p++) {
    html += `<button class="page-btn ${p === currentPage ? "active" : ""}" onclick="goToPage(${p})">${toBnNumber(p)}</button>`;
  }

  html += `<button class="page-btn" ${currentPage === displayPages ? "disabled" : ""} onclick="goToPage(${currentPage + 1})">পরবর্তী &gt;</button>`;
  pagEl.innerHTML = html;
}

window.goToPage = function (page) {
  currentPage = page;
  renderFeed();
  const feedSection = document.getElementById("feedGrid");
  if (feedSection) {
    feedSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

function getStatusBadgeHTML(status) {
  if (status === "verified") return `<span class="badge badge-verified">✓ ভেরিফাইড</span>`;
  if (status === "fake") return `<span class="badge badge-fake">✕ ভুয়া প্রমাণিত</span>`;
  if (status === "partially_true") return `<span class="badge badge-partially">⚖️ আংশিক সত্য</span>`;
  if (status === "investigating") return `<span class="badge badge-investigating">⏳ তদন্তাধীন</span>`;
  return `<span class="badge badge-unverified">? অজানা</span>`;
}

function createPostCardHTML(r) {
  const statusBadge = getStatusBadgeHTML(r.status);
  let reporterBadge = `<span class="badge badge-identified">👤 ${r.reporterName}</span>`;
  if (r.reporterType === "anonymous") reporterBadge = `<span class="badge badge-anonymous">🕵️ বেনামি</span>`;
  if (r.reporterType === "official") reporterBadge = `<span class="badge badge-official">🛡️ Criminal Zoo ডেস্ক</span>`;

  const photos = (r.mediaUrls && r.mediaUrls.length) ? r.mediaUrls : (r.mediaUrl ? [r.mediaUrl] : []);
  const pills = [];
  if (photos.length > 0) {
    pills.push(`<span class="media-type-tag">🎞️ ${toBnNumber(photos.length)}টি ছবি (Auto Slide)</span>`);
  }
  if (r.videoUrl) pills.push(`<span class="media-type-tag">🎥 ভিডিও</span>`);
  if (r.audioUrl) pills.push(`<span class="media-type-tag">🎙️ অডিও</span>`);
  if (r.pdfUrl) pills.push(`<span class="media-type-tag">📄 PDF দলিল</span>`);

  const isLiked = localStorage.getItem(`cz_liked_${r.id}`) === "true";
  const thumbUrl = photos[0] || "./assets/icons/banner.jpg";

  return `
    <article class="post-card reveal-anim" onclick="openQuickView('${r.id}')">
      <div class="post-thumb-wrapper">
        <img src="${thumbUrl}" alt="${r.title}" class="post-thumb" loading="lazy">
        <div class="protected-media-shield"></div>
        <div class="thumb-badges">
          <div style="display: flex; gap: 0.35rem; flex-wrap: wrap;">${statusBadge} ${reporterBadge}</div>
        </div>
        <div class="media-bundle-pills">${pills.join("")}</div>
      </div>
      <div class="post-body">
        <div class="post-meta-top">
          <span>📍 ${r.location}</span>
          <span>🕒 ${r.date}</span>
        </div>
        <h3 class="post-title">${r.title}</h3>
        <p class="post-snippet">${r.description}</p>
        <div class="post-location-tag">🏷️ ${r.category} • আইডি: ${r.id}</div>
        <div class="post-footer-actions">
          <div class="action-group">
            <span class="action-item ${isLiked ? 'liked' : ''}" onclick="event.stopPropagation(); handleCardLike('${r.id}', this)">
              ❤️ <span>${toBnNumber(r.likes || 0)}</span>
            </span>
            <span class="action-item">
              💬 <span>${toBnNumber((r.comments && r.comments.length) || 0)}</span>
            </span>
            <span class="action-item">
              👁️ <span>${toBnNumber(r.views || 0)}</span>
            </span>
          </div>
          <span class="quick-view-prompt">অটো স্লাইড ও জুম →</span>
        </div>
      </div>
    </article>
  `;
}

// 4. Category Filters & Search
function initCategoryFilters() {
  const tabs = document.querySelectorAll(".cat-btn");
  tabs.forEach(tab => {
    tab.addEventListener("click", function () {
      tabs.forEach(t => t.classList.remove("active"));
      this.classList.add("active");
      currentActiveFilter = this.getAttribute("data-category") || "all";
      currentPage = 1;
      renderFeed();
    });
  });
}

function initSearch() {
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) return;
  searchInput.addEventListener("input", function (e) {
    currentSearchQuery = e.target.value;
    currentPage = 1;
    renderFeed();
  });
}

// ==========================================================================
// 5. SINGLE-PAGE POPUP MODAL WITH AUTO SLIDE VIEW (Requirement #5),
//    IMAGE ZOOM, VIDEO/AUDIO RUNNER & PDF PREVIEW
// ==========================================================================
let currentViewingReport = null;
let currentZoomScale = 1;
let audioWaveInterval = null;
let autoSlideInterval = null;
let currentSlideIndex = 0;
let isAutoSlidePlaying = true;

function stopAutoSlideTimer() {
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval);
    autoSlideInterval = null;
  }
}

function startAutoSlideTimer() {
  stopAutoSlideTimer();
  if (!isAutoSlidePlaying || !currentViewingReport) return;
  const photos = getReportPhotos(currentViewingReport);
  if (photos.length <= 1) return;

  autoSlideInterval = setInterval(() => {
    if (!isAutoSlidePlaying) return;
    currentSlideIndex = (currentSlideIndex + 1) % photos.length;
    updateSlideViewDOM();
  }, 2600);
}

function getReportPhotos(r) {
  if (!r) return [];
  if (r.mediaUrls && Array.isArray(r.mediaUrls) && r.mediaUrls.length > 0) {
    return r.mediaUrls;
  }
  if (r.mediaUrl) return [r.mediaUrl];
  return [];
}

function openQuickView(reportId) {
  const reports = StorageManager.getReports();
  const r = reports.find(item => item.id === reportId);
  if (!r) return;

  currentViewingReport = r;
  currentZoomScale = 1;
  currentSlideIndex = 0;
  isAutoSlidePlaying = true;
  r.views = StorageManager.incrementView(reportId);

  const modalBackdrop = document.getElementById("postQuickModal");
  if (!modalBackdrop) return;

  const statusBadge = getStatusBadgeHTML(r.status);
  let reporterBadge = r.reporterType === "anonymous"
    ? `<span class="badge badge-anonymous">🕵️ বেনামি নাগরিক অভিযোগ</span>`
    : `<span class="badge badge-identified">👤 রিপোর্টার: ${r.reporterName}</span>`;

  document.getElementById("modalBadges").innerHTML = `${statusBadge} ${reporterBadge}`;
  document.getElementById("modalTitle").innerText = r.title;
  document.getElementById("modalDate").innerText = `${r.date} • ${r.time}`;
  document.getElementById("modalLocation").innerText = r.location;
  document.getElementById("modalCategory").innerText = r.category;
  document.getElementById("modalCaseId").innerText = r.id;
  document.getElementById("modalViews").innerText = toBnNumber(r.views || 1);
  document.getElementById("modalText").innerText = r.description;

  const score = r.truthScore !== undefined ? r.truthScore : 75;
  document.getElementById("truthScorePercent").innerText = toBnNumber(score) + "%";
  const barInner = document.getElementById("truthScoreBar");
  let meterClass = "meter-bar-verified";
  if (r.status === "fake") meterClass = "meter-bar-fake";
  else if (r.status === "investigating" || r.status === "partially_true") meterClass = "meter-bar-investigating";
  barInner.className = `meter-bar-inner ${meterClass}`;
  barInner.style.width = score + "%";
  document.getElementById("truthScoreNote").innerText = r.statusNote || "ফরেনসিক যাচাই চলমান।";

  const photos = getReportPhotos(r);
  const tabsBar = document.getElementById("modalEvidenceTabs");
  if (tabsBar) {
    const tabButtons = [];
    if (photos.length > 0) {
      tabButtons.push(`<button class="evidence-tab-btn active" onclick="switchEvidenceTab('photo', this)">🎞️ ছবি অটো স্লাইড (${toBnNumber(photos.length)}টি)</button>`);
    }
    if (r.videoUrl) tabButtons.push(`<button class="evidence-tab-btn" onclick="switchEvidenceTab('video', this)">🎥 ভিডিও ফুটেজ</button>`);
    if (r.audioUrl) tabButtons.push(`<button class="evidence-tab-btn" onclick="switchEvidenceTab('audio', this)">🎙️ অডিও রেকর্ড</button>`);
    if (r.pdfUrl) tabButtons.push(`<button class="evidence-tab-btn" onclick="switchEvidenceTab('pdf', this)">📄 পিডিএফ দলিল (প্রিভিউ)</button>`);
    tabsBar.innerHTML = tabButtons.join("");
  }

  if (photos.length > 0) renderEvidenceStage("photo");
  else if (r.videoUrl) renderEvidenceStage("video");
  else if (r.audioUrl) renderEvidenceStage("audio");
  else if (r.pdfUrl) renderEvidenceStage("pdf");

  const isLiked = localStorage.getItem(`cz_liked_${r.id}`) === "true";
  const likeBtn = document.getElementById("modalLikeBtn");
  if (likeBtn) {
    likeBtn.className = `modal-action-btn ${isLiked ? "active-like" : ""}`;
    document.getElementById("modalLikeCount").innerText = toBnNumber(r.likes || 0);
  }

  // Requirement #6: Only logged-in reporters see secret code / direct truth tracking link
  const trackLinkBtn = document.querySelector(".modal-actions-bar a[href*='track-report.html']");
  const loggedReporter = sessionStorage.getItem("cz_logged_reporter");
  if (trackLinkBtn) {
    if (loggedReporter) {
      trackLinkBtn.href = `./track-report.html?id=${r.id}&pin=${r.pin}`;
      trackLinkBtn.innerHTML = `🔍 সত্যতা ট্র্যাক করুন (গোপন কোড: ${r.pin})`;
      trackLinkBtn.style.display = "inline-flex";
    } else {
      trackLinkBtn.href = `./reporter-login.html`;
      trackLinkBtn.innerHTML = `🔒 রিপোর্টার ট্র্যাকিং (লগইন আবশ্যক)`;
    }
  }

  renderModalComments(r.comments || []);
  modalBackdrop.classList.add("active");
  document.body.style.overflow = "hidden";
}

window.switchEvidenceTab = function (type, btnEl) {
  document.querySelectorAll(".evidence-tab-btn").forEach(b => b.classList.remove("active"));
  if (btnEl) btnEl.classList.add("active");
  renderEvidenceStage(type);
};

function renderEvidenceStage(type) {
  const stage = document.getElementById("modalMediaWrapper");
  if (!stage || !currentViewingReport) return;
  const r = currentViewingReport;
  currentZoomScale = 1;
  if (audioWaveInterval) clearInterval(audioWaveInterval);
  stopAutoSlideTimer();

  if (type === "photo") {
    const photos = getReportPhotos(r);
    const activePhoto = photos[currentSlideIndex] || "./assets/icons/banner.jpg";

    const thumbsHtml = photos.length > 1
      ? `<div style="display:flex; gap:0.45rem; padding:0.6rem 0.85rem; background:rgba(6,9,17,0.95); width:100%; overflow-x:auto; justify-content:center; border-top:1px solid rgba(255,255,255,0.08);">
          ${photos.map((url, idx) => `
            <div onclick="jumpToSlide(${idx})" class="slide-thumb-item" data-slide-idx="${idx}" style="width:54px; height:42px; border-radius:6px; overflow:hidden; cursor:pointer; border:2px solid ${idx === currentSlideIndex ? '#dc2626' : 'rgba(255,255,255,0.18)'}; opacity:${idx === currentSlideIndex ? '1' : '0.55'}; flex-shrink:0; transition:all 0.2s;">
              <img src="${url}" style="width:100%; height:100%; object-fit:cover;">
            </div>
          `).join("")}
        </div>`
      : "";

    stage.innerHTML = `
      <div class="zoom-image-viewport" id="zoomViewport" style="position:relative;">
        <img src="${activePhoto}" id="zoomTargetImg" alt="${r.title}" style="transition: opacity 0.35s ease, transform 0.25s ease;">
        <div class="protected-media-shield"></div>
        ${photos.length > 1 ? `
          <button type="button" onclick="prevSlidePhoto()" style="position:absolute; left:12px; top:50%; transform:translateY(-50%); z-index:15; background:rgba(6,9,17,0.8); border:1px solid rgba(255,255,255,0.25); color:#fff; width:38px; height:38px; border-radius:50%; cursor:pointer; font-size:1.1rem;">❮</button>
          <button type="button" onclick="nextSlidePhoto()" style="position:absolute; right:12px; top:50%; transform:translateY(-50%); z-index:15; background:rgba(6,9,17,0.8); border:1px solid rgba(255,255,255,0.25); color:#fff; width:38px; height:38px; border-radius:50%; cursor:pointer; font-size:1.1rem;">❯</button>
          <div id="slideCounterBadge" style="position:absolute; top:12px; right:12px; z-index:15; background:rgba(220,38,38,0.88); color:#fff; padding:0.25rem 0.7rem; border-radius:99px; font-size:0.78rem; font-weight:700;">
            🎞️ স্লাইড ${toBnNumber(currentSlideIndex + 1)} / ${toBnNumber(photos.length)} (Auto Slide)
          </div>
        ` : ""}
      </div>
      ${thumbsHtml}
      <div class="zoom-controls-toolbar" style="flex-wrap:wrap;">
        ${photos.length > 1 ? `
          <button type="button" class="btn btn-primary btn-sm" id="autoSlideToggleBtn" onclick="toggleAutoSlidePlay()">
            ⏸ অটো স্লাইড চালু
          </button>
        ` : ""}
        <button type="button" class="btn btn-secondary btn-sm" onclick="adjustImageZoom(0.25)">🔍 জুম ইন (+)</button>
        <button type="button" class="btn btn-secondary btn-sm" onclick="adjustImageZoom(-0.25)">🔍 জুম আউট (-)</button>
        <button type="button" class="btn btn-outline btn-sm" onclick="resetImageZoom()">↺ ১০০% রিসেট</button>
        <span style="font-size: 0.78rem; color: #94a3b8; margin-left: 0.5rem;">🔒 ডাউনলোড ও প্রিন্ট লককৃত</span>
      </div>
    `;

    if (photos.length > 1) {
      startAutoSlideTimer();
    }
  } else if (type === "video") {
    const isDirectVideo = r.videoUrl && (r.videoUrl.endsWith(".mp4") || r.videoUrl.startsWith("data:video") || r.videoUrl.includes("commondatastorage") || r.videoUrl.startsWith("blob:"));
    stage.innerHTML = `
      <div class="custom-media-player">
        <div style="position: relative; border-radius: 10px; overflow: hidden; background: #000;">
          ${isDirectVideo ? `
            <video id="czProtectedVideo" src="${r.videoUrl}" poster="${r.mediaUrl}" style="width: 100%; max-height: 400px;" controlsList="nodownload noplaybackrate" disablePictureInPicture oncontextmenu="return false;"></video>
          ` : `
            <img src="${r.mediaUrl}" style="width: 100%; max-height: 360px; object-fit: cover; opacity: 0.65;">
            <div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(0,0,0,0.45);">
              <div style="font-size: 2.5rem;">🎥</div>
              <div style="font-weight: 700; color: #fff; margin-top: 0.4rem;">সুরক্ষিত ভিডিও স্ট্রিম প্লেয়ার</div>
              <div style="font-size: 0.82rem; color: #38bdf8;">সোর্স: ${r.videoUrl}</div>
            </div>
          `}
        </div>
        <div class="player-controls-row">
          <button class="btn btn-primary btn-sm" onclick="toggleProtectedVideo(this)">▶ ভিডিও চালান</button>
          <div class="player-progress-track" onclick="seekProtectedVideo(event, this)">
            <div class="player-progress-fill" id="videoProgressFill" style="width: 0%;"></div>
          </div>
          <span style="font-size: 0.78rem; color: #f87171;">🔒 No-Download Stream</span>
        </div>
      </div>
    `;
  } else if (type === "audio") {
    stage.innerHTML = `
      <div class="custom-media-player">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
          <div>
            <div style="font-weight: 700; color: #fff;">🎙️ এনক্রিপ্টেড ফরেনসিক অডিও রেকর্ড</div>
            <div style="font-size: 0.8rem; color: #94a3b8;">কেস আইডি: ${r.id} • ভয়েস স্পেকট্রাম স্ট্রিম</div>
          </div>
          <span class="badge badge-verified">🔒 ডাউনলোড লককৃত</span>
        </div>
        ${r.audioUrl && r.audioUrl.startsWith("data:audio") ? `<audio id="czRealAudio" src="${r.audioUrl}" style="display:none;"></audio>` : ""}
        <div class="player-controls-row">
          <button class="btn btn-primary btn-sm" onclick="toggleProtectedAudio(this)">▶ অডিও শুনুন</button>
          <div class="player-progress-track">
            <div class="player-progress-fill" id="audioProgressFill" style="width: 15%;"></div>
          </div>
          <span id="audioTimerLabel" style="font-size: 0.82rem; color: #38bdf8; font-weight: 700;">০০:০০ / ০২:১৫</span>
        </div>
      </div>
    `;
  } else if (type === "pdf") {
    stage.innerHTML = `
      <div class="pdf-viewer-frame">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.85rem; flex-wrap: wrap; gap: 0.5rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span style="font-size: 1.4rem;">📄</span>
            <div>
              <div style="font-weight: 700; color: #fff; font-size: 0.95rem;">${r.pdfUrl || "evidence-document.pdf"}</div>
              <div style="font-size: 0.75rem; color: #38bdf8;">Criminal Zoo Protected PDF Reader (শুধু পাঠযোগ্য • ডাউনলোড ও প্রিন্ট নিষিদ্ধ)</div>
            </div>
          </div>
          <div style="display: flex; gap: 0.4rem;">
            <button class="btn btn-secondary btn-sm" onclick="adjustPdfFontSize(1)">A+ ফন্ট বড়</button>
            <button class="btn btn-secondary btn-sm" onclick="adjustPdfFontSize(-1)">A- ফন্ট ছোট</button>
          </div>
        </div>
        <div class="pdf-page-canvas" id="pdfCanvasContent">
          <div style="border-bottom: 1px solid rgba(255,255,255,0.12); padding-bottom: 0.75rem; margin-bottom: 0.85rem; display: flex; justify-content: space-between; font-size: 0.8rem; color: #94a3b8;">
            <span>দালিলিক প্রমাণ সংযুক্তি: ${r.id}</span>
            <span>সত্যতা স্কোর: ${toBnNumber(r.truthScore || 90)}%</span>
          </div>
          <h4 style="color: #fff; margin-bottom: 0.6rem;">সারসংক্ষেপ ও ফরেনসিক নথি বিবরণ:</h4>
          <p style="line-height: 1.8; color: #cbd5e1; margin-bottom: 1rem;">
            ${r.pdfSummary || "এই কেসের সাথে সংযুক্ত পিডিএফ দালিলিক প্রমাণটি ফরেনসিক যাচাইয়ের জন্য সংরক্ষিত রয়েছে।"}
          </p>
          <div style="background: rgba(220, 38, 38, 0.1); border-left: 3px solid #dc2626; padding: 0.75rem 1rem; font-size: 0.85rem; color: #fca5a5;">
            🔒 নিরাপত্তা নোট: সাক্ষী ও তথ্যদাতার সুরক্ষার স্বার্থে এই পিডিএফ ডকুমেন্টটি ব্রাউজারে শুধুমাত্র প্রিভিউ ও পড়ার জন্য উন্মুক্ত। কোনো অবস্থাতেই ডাউনলোড বা প্রিন্ট করা যাবে না।
          </div>
        </div>
      </div>
    `;
  }
}

function updateSlideViewDOM() {
  if (!currentViewingReport) return;
  const photos = getReportPhotos(currentViewingReport);
  if (photos.length === 0) return;

  const img = document.getElementById("zoomTargetImg");
  const badge = document.getElementById("slideCounterBadge");
  if (img) {
    img.style.opacity = "0.35";
    setTimeout(() => {
      img.src = photos[currentSlideIndex];
      img.style.opacity = "1";
    }, 120);
  }
  if (badge) {
    badge.innerText = `🎞️ স্লাইড ${toBnNumber(currentSlideIndex + 1)} / ${toBnNumber(photos.length)} (${isAutoSlidePlaying ? "Auto Slide" : "Paused"})`;
  }
  document.querySelectorAll(".slide-thumb-item").forEach(el => {
    const idx = parseInt(el.getAttribute("data-slide-idx"), 10);
    el.style.borderColor = idx === currentSlideIndex ? "#dc2626" : "rgba(255,255,255,0.18)";
    el.style.opacity = idx === currentSlideIndex ? "1" : "0.55";
  });
}

window.nextSlidePhoto = function () {
  if (!currentViewingReport) return;
  const photos = getReportPhotos(currentViewingReport);
  if (photos.length <= 1) return;
  currentSlideIndex = (currentSlideIndex + 1) % photos.length;
  updateSlideViewDOM();
};

window.prevSlidePhoto = function () {
  if (!currentViewingReport) return;
  const photos = getReportPhotos(currentViewingReport);
  if (photos.length <= 1) return;
  currentSlideIndex = (currentSlideIndex - 1 + photos.length) % photos.length;
  updateSlideViewDOM();
};

window.jumpToSlide = function (idx) {
  currentSlideIndex = idx;
  updateSlideViewDOM();
};

window.toggleAutoSlidePlay = function () {
  isAutoSlidePlaying = !isAutoSlidePlaying;
  const btn = document.getElementById("autoSlideToggleBtn");
  if (btn) {
    btn.innerText = isAutoSlidePlaying ? "⏸ অটো স্লাইড চালু" : "▶ অটো স্লাইড চালান";
  }
  if (isAutoSlidePlaying) startAutoSlideTimer();
  else stopAutoSlideTimer();
  updateSlideViewDOM();
};

window.adjustImageZoom = function (delta) {
  currentZoomScale = Math.min(3.5, Math.max(0.5, currentZoomScale + delta));
  const img = document.getElementById("zoomTargetImg");
  if (img) {
    img.style.transform = `scale(${currentZoomScale})`;
  }
};

window.resetImageZoom = function () {
  currentZoomScale = 1;
  const img = document.getElementById("zoomTargetImg");
  if (img) img.style.transform = "scale(1)";
};

let pdfFontSize = 0.95;
window.adjustPdfFontSize = function (dir) {
  pdfFontSize = Math.min(1.35, Math.max(0.8, pdfFontSize + dir * 0.08));
  const c = document.getElementById("pdfCanvasContent");
  if (c) c.style.fontSize = pdfFontSize + "rem";
};

window.toggleProtectedVideo = function (btn) {
  const v = document.getElementById("czProtectedVideo");
  const fill = document.getElementById("videoProgressFill");
  if (v) {
    if (v.paused) {
      v.play();
      btn.innerText = "⏸ বিরতি (Pause)";
      v.ontimeupdate = () => {
        if (v.duration && fill) {
          fill.style.width = ((v.currentTime / v.duration) * 100) + "%";
        }
      };
    } else {
      v.pause();
      btn.innerText = "▶ ভিডিও চালান";
    }
  } else {
    if (btn.innerText.includes("চালান")) {
      btn.innerText = "⏸ স্ট্রিমিং চলছে...";
      if (fill) fill.style.width = "65%";
    } else {
      btn.innerText = "▶ ভিডিও চালান";
    }
  }
};

window.seekProtectedVideo = function (e, track) {
  const v = document.getElementById("czProtectedVideo");
  if (v && v.duration) {
    const rect = track.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    v.currentTime = ratio * v.duration;
  }
};

window.toggleProtectedAudio = function (btn) {
  const realAudio = document.getElementById("czRealAudio");
  const fill = document.getElementById("audioProgressFill");
  const timer = document.getElementById("audioTimerLabel");

  if (realAudio) {
    if (realAudio.paused) {
      realAudio.play();
      btn.innerText = "⏸ পজ অডিও";
    } else {
      realAudio.pause();
      btn.innerText = "▶ অডিও শুনুন";
    }
    return;
  }

  if (btn.innerText.includes("শুনুন")) {
    btn.innerText = "⏸ পজ অডিও";
    let pct = 15;
    let sec = 18;
    audioWaveInterval = setInterval(() => {
      pct = (pct + 2) % 100;
      sec = (sec + 1) % 135;
      if (fill) fill.style.width = pct + "%";
      if (timer) {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        timer.innerText = `০${toBnNumber(m)}:${s < 10 ? "০" : ""}${toBnNumber(s)} / ০২:১৫`;
      }
    }, 500);
  } else {
    btn.innerText = "▶ অডিও শুনুন";
    if (audioWaveInterval) clearInterval(audioWaveInterval);
  }
};

function closeQuickView() {
  const modalBackdrop = document.getElementById("postQuickModal");
  if (modalBackdrop) {
    modalBackdrop.classList.remove("active");
    document.body.style.overflow = "auto";
  }
  if (audioWaveInterval) clearInterval(audioWaveInterval);
  stopAutoSlideTimer();
  currentViewingReport = null;
  renderFeed();
}

function initModalListeners() {
  const modalBackdrop = document.getElementById("postQuickModal");
  if (!modalBackdrop) return;
  modalBackdrop.addEventListener("click", function (e) {
    if (e.target === modalBackdrop) closeQuickView();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modalBackdrop.classList.contains("active")) closeQuickView();
  });
}

function handleCardLike(reportId, el) {
  const res = StorageManager.toggleLike(reportId);
  const countSpan = el.querySelector("span");
  if (countSpan) countSpan.innerText = toBnNumber(res.likes);
  if (res.isLiked) el.classList.add("liked");
  else el.classList.remove("liked");
}

function handleModalLike() {
  if (!currentViewingReport) return;
  const res = StorageManager.toggleLike(currentViewingReport.id);
  currentViewingReport.likes = res.likes;
  const likeBtn = document.getElementById("modalLikeBtn");
  if (likeBtn) {
    likeBtn.className = `modal-action-btn ${res.isLiked ? "active-like" : ""}`;
    document.getElementById("modalLikeCount").innerText = toBnNumber(res.likes);
  }
}

function renderModalComments(comments) {
  const listEl = document.getElementById("modalCommentsList");
  if (!listEl) return;
  if (!comments || comments.length === 0) {
    listEl.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 1.25rem;">এখনো কোনো মন্তব্য নেই। প্রথম মতামতটি আপনি দিন।</div>`;
    return;
  }
  listEl.innerHTML = comments.map(c => `
    <div class="comment-item">
      <div style="display:flex; justify-content:space-between; margin-bottom:0.3rem;">
        <span style="font-weight:700; color:#38bdf8; font-size:0.88rem;">🛡️ ${c.user}</span>
        <span style="font-size:0.75rem; color:var(--text-muted);">${c.date}</span>
      </div>
      <p style="font-size:0.92rem; color:#e2e8f0;">${c.text}</p>
    </div>
  `).join("");
}

function submitModalComment() {
  if (!currentViewingReport) return;
  const userEl = document.getElementById("commentAuthorInput");
  const textEl = document.getElementById("commentTextInput");
  const author = userEl ? userEl.value.trim() : "";
  const text = textEl ? textEl.value.trim() : "";

  if (!text) {
    if (window.showSecurityNotice) window.showSecurityNotice("অনুগ্রহ করে মন্তব্য লিখুন।");
    return;
  }

  StorageManager.addComment(currentViewingReport.id, author, text);
  if (textEl) textEl.value = "";
  const updated = StorageManager.getReports().find(r => r.id === currentViewingReport.id);
  if (updated) {
    currentViewingReport = updated;
    renderModalComments(updated.comments || []);
  }
}

window.openQuickView = openQuickView;
window.closeQuickView = closeQuickView;
window.handleCardLike = handleCardLike;
window.handleModalLike = handleModalLike;
window.submitModalComment = submitModalComment;
