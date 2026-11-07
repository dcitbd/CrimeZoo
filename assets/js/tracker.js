/**
 * CRIMINAL ZOO - REPORTER-EXCLUSIVE TRUTH TRACKING CONTROLLER (Requirement #6)
 * Only users who are logged in as a Reporter (or Admin) can access Truth Tracking
 * and view/use Secret Tracking Codes.
 */

document.addEventListener("DOMContentLoaded", function () {
  enforceReporterTrackingAccess();
});

function enforceReporterTrackingAccess() {
  const repRaw = sessionStorage.getItem("cz_logged_reporter");
  const isAdmin = sessionStorage.getItem("cz_admin_timelock") === "true";
  const gateBox = document.getElementById("reporterOnlyGateBox");
  const trackerWorkspace = document.getElementById("reporterTrackerWorkspace");

  if (!repRaw && !isAdmin) {
    if (gateBox) gateBox.style.display = "block";
    if (trackerWorkspace) trackerWorkspace.style.display = "none";
    return;
  }

  if (gateBox) gateBox.style.display = "none";
  if (trackerWorkspace) trackerWorkspace.style.display = "block";

  let currentReporter = null;
  if (repRaw) {
    try { currentReporter = JSON.parse(repRaw); } catch (e) {}
  }

  renderReporterSecretCodesList(currentReporter, isAdmin);
  initUrlParams();
  initTrackerForm();
}

function renderReporterSecretCodesList(rep, isAdmin) {
  const listContainer = document.getElementById("mySecretCodesContainer");
  if (!listContainer) return;

  const allReports = StorageManager.getReports();
  const myReports = isAdmin
    ? allReports.slice(0, 8)
    : allReports.filter(r => (rep && (r.reporterId === rep.id || r.reporterName === rep.name)));

  if (myReports.length === 0) {
    listContainer.innerHTML = `<div style="font-size:0.85rem; color:var(--text-muted);">আপনার অ্যাকাউন্ট থেকে এখনো কোনো পোস্ট জমা দেওয়া হয়নি। নতুন পোস্ট করলে এখানে গোপন ট্র্যাকিং কোড দেখতে পাবেন।</div>`;
    return;
  }

  listContainer.innerHTML = myReports.map(r => `
    <div onclick="fillAndTrack('${r.id}', '${r.pin}')" style="background:rgba(15,23,42,0.9); border:1px solid rgba(56,189,248,0.3); border-radius:10px; padding:0.7rem 1rem; cursor:pointer; display:flex; justify-content:space-between; align-items:center; gap:0.75rem; transition:all 0.2s;">
      <div>
        <div style="font-weight:700; color:#fff; font-size:0.88rem;">${r.id} — ${r.title.slice(0, 42)}...</div>
        <div style="font-size:0.75rem; color:#94a3b8;">📍 ${r.location} • স্ট্যাটাস: ${r.approvalStatus === 'approved' ? '<span style="color:#34d399;">লাইভ (Approved)</span>' : '<span style="color:#fbbf24;">এডমিন অনুমোদনের অপেক্ষায়</span>'}</div>
      </div>
      <div style="text-align:right; flex-shrink:0;">
        <span class="badge badge-verified" style="font-size:0.8rem;">🔑 পিন: ${r.pin}</span>
      </div>
    </div>
  `).join("");
}

window.fillAndTrack = function (id, pin) {
  const idInput = document.getElementById("trackCaseId");
  const pinInput = document.getElementById("trackPin");
  if (idInput) idInput.value = id;
  if (pinInput) pinInput.value = pin;
  performTrackLookup(id, pin);
};

function initUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  const pin = urlParams.get("pin");

  if (id && pin) {
    const idInput = document.getElementById("trackCaseId");
    const pinInput = document.getElementById("trackPin");
    if (idInput) idInput.value = id;
    if (pinInput) pinInput.value = pin;
    performTrackLookup(id, pin);
  }
}

function initTrackerForm() {
  const form = document.getElementById("trackCaseForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const id = document.getElementById("trackCaseId").value.trim();
    const pin = document.getElementById("trackPin").value.trim();

    if (!id || !pin) {
      if (window.showSecurityNotice) window.showSecurityNotice("অনুগ্রহ করে ট্র্যাকিং আইডি ও গোপন পিন নম্বর প্রদান করুন।");
      return;
    }

    performTrackLookup(id, pin);
  });
}

function performTrackLookup(caseId, pin) {
  const reports = StorageManager.getReports();
  const r = reports.find(item => item.id.toUpperCase() === caseId.toUpperCase() && item.pin === pin);

  const resultContainer = document.getElementById("trackingResultArea");
  if (!resultContainer) return;

  if (!r) {
    resultContainer.innerHTML = `
      <div style="background: rgba(220, 38, 38, 0.15); border: 1px solid #dc2626; border-radius: 12px; padding: 2rem; text-align: center; color: #fca5a5; margin-top: 1.5rem;">
        <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">⚠️</div>
        <h3>কোনো তথ্য মেলেনি!</h3>
        <p style="margin-top: 0.5rem;">ট্র্যাকিং আইডি <strong>${caseId}</strong> এবং গোপন পিন নম্বর যাচাই করুন। সঠিক তথ্য প্রদান না করলে নিরাপত্তা রক্ষার্থে কোনো রেকর্ড প্রদর্শন করা হয় না।</p>
      </div>
    `;
    resultContainer.style.display = "block";
    return;
  }

  let stage3 = (r.status === "verified" || r.status === "fake") ? "completed" : "in-progress";
  let stage4 = (r.status === "verified" || r.status === "fake") ? "completed" : "pending";

  let statusBadge = "";
  if (r.status === "verified") statusBadge = `<span class="badge badge-verified">✓ সত্যতা নিশ্চিত (Verified)</span>`;
  else if (r.status === "fake") statusBadge = `<span class="badge badge-fake">✕ প্রমাণিত মিথ্যা (Fake)</span>`;
  else if (r.status === "investigating") statusBadge = `<span class="badge badge-investigating">⏳ তদন্ত চলছে (Investigating)</span>`;
  else statusBadge = `<span class="badge badge-unverified">? তথ্য যাচাই প্রক্রিয়াধীন</span>`;

  const approvalBadge = r.approvalStatus === "approved"
    ? `<span class="badge badge-verified">🌐 লাইভ ফিডে প্রকাশিত (Approved)</span>`
    : `<span class="badge badge-investigating">⏳ এডমিন অনুমোদনের অপেক্ষায় (Pending Approval)</span>`;

  resultContainer.innerHTML = `
    <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 16px; padding: 2rem; margin-top: 2rem;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
        <div>
          <span style="font-size: 0.85rem; color: var(--text-muted);">রিপোর্টার এক্সক্লুসিভ ট্র্যাকিং আইডি ও গোপন পিন</span>
          <h2 style="font-size: 1.5rem; font-weight: 700; color: #fff; margin-top: 2px;">${r.id} <span style="font-size:0.95rem; color:#34d399;">(গোপন পিন: ${r.pin})</span></h2>
          <div style="margin-top: 0.5rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">${statusBadge} ${approvalBadge}</div>
        </div>
        <div style="text-align: right;">
          <span style="font-size: 0.85rem; color: var(--text-muted);">দাখিলের তারিখ</span>
          <div style="font-weight: 600; color: #cbd5e1; margin-top: 2px;">${r.date} (${r.time})</div>
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">স্থান: ${r.location}</div>
        </div>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <h4 style="font-size: 1.1rem; color: #fff; margin-bottom: 0.5rem;">অভিযোগের শিরোনাম: ${r.title}</h4>
        <p style="color: var(--text-secondary); line-height: 1.6; font-size: 0.95rem;">${r.description}</p>
      </div>

      <h4 style="font-size: 1rem; color: #94a3b8; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.05em;">তদন্ত ও লাইভ অনুমোদন টাইমলাইন</h4>
      <div style="display: flex; flex-direction: column; gap: 1.25rem; border-left: 2px solid var(--border-color); padding-left: 1.5rem; margin-left: 0.5rem; position: relative;">
        <div style="position: relative;">
          <div style="position: absolute; left: -1.95rem; top: 0; width: 14px; height: 14px; border-radius: 50%; background: #10b981; border: 3px solid #0f172a;"></div>
          <h5 style="color: #fff; font-size: 0.95rem;">১. অভিযোগ সফলভাবে গ্রহণ ও এনক্রিপ্টকরণ</h5>
          <p style="font-size: 0.85rem; color: var(--text-muted);">রিপোর্টারের দাখিলকৃত তথ্য ও মিডিয়া ডাটাবেজে সংরক্ষিত হয়েছে।</p>
        </div>
        <div style="position: relative;">
          <div style="position: absolute; left: -1.95rem; top: 0; width: 14px; height: 14px; border-radius: 50%; background: #10b981; border: 3px solid #0f172a;"></div>
          <h5 style="color: #fff; font-size: 0.95rem;">২. ডিজিটাল ফরেনসিক ও এআই ফিল্টারিং পরীক্ষা</h5>
          <p style="font-size: 0.85rem; color: var(--text-muted);">ছবি, ভিডিও ও অডিওর সত্যতা যাচাই এবং মেটাডাটা স্ক্রিনিং সম্পন্ন (স্কোর: ${r.truthScore || 78}%)।</p>
        </div>
        <div style="position: relative;">
          <div style="position: absolute; left: -1.95rem; top: 0; width: 14px; height: 14px; border-radius: 50%; background: ${r.approvalStatus === 'approved' ? '#10b981' : '#f59e0b'}; border: 3px solid #0f172a;"></div>
          <h5 style="color: #fff; font-size: 0.95rem;">৩. এডমিন অনুমোদন ও পাবলিক ফিডে প্রকাশ</h5>
          <p style="font-size: 0.85rem; color: var(--text-muted);">${r.approvalStatus === 'approved' ? 'এডমিন কর্তৃক অনুমোদিত হয়ে মূল ওয়েবসাইটে লাইভ প্রকাশিত হয়েছে।' : 'এডমিন প্যানেলে অনুমোদনের অপেক্ষায় রয়েছে; এপ্রুভ করলেই সাথে সাথে লাইভ হয়ে যাবে।'}</p>
        </div>
        <div style="position: relative;">
          <div style="position: absolute; left: -1.95rem; top: 0; width: 14px; height: 14px; border-radius: 50%; background: ${stage4 === 'completed' ? (r.status === 'verified' ? '#10b981' : '#dc2626') : '#64748b'}; border: 3px solid #0f172a;"></div>
          <h5 style="color: #fff; font-size: 0.95rem;">৪. চূড়ান্ত ফরেনসিক সিদ্ধান্ত</h5>
          <p style="font-size: 0.85rem; color: var(--text-muted);">${r.statusNote}</p>
        </div>
      </div>
    </div>
  `;
  resultContainer.style.display = "block";
}
