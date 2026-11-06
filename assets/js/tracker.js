/**
 * CRIME ZOO - RESTRICTED CASE TRACKING ENGINE
 * Rule 6: শুধুমাত্র যারা রিপোর্টার হিসেবে লগইন করেছেন তারাই ট্র্যাকিং কোড দিয়ে স্ট্যাটাস যাচাই করতে পারবেন।
 */

document.addEventListener("DOMContentLoaded", function () {
  checkReporterTrackingAuth();
});

function checkReporterTrackingAuth() {
  const repStr = sessionStorage.getItem("cz_logged_reporter");
  const authGate = document.getElementById("trackerAuthGate");
  const formBox = document.getElementById("trackerFormContainer");

  if (!repStr) {
    if (authGate) authGate.style.display = "block";
    if (formBox) formBox.style.display = "none";
    return;
  }

  // Reporter is authenticated
  if (authGate) authGate.style.display = "none";
  if (formBox) formBox.style.display = "block";

  const rep = JSON.parse(repStr);
  const repBanner = document.getElementById("loggedReporterBanner");
  if (repBanner) {
    repBanner.innerHTML = `✓ ভেরিফাইড রিপোর্টার মোড: <strong>${rep.name}</strong> (${rep.badgeNo}) হিসেবে ট্র্যাকিং পোর্টালে সংযুক্ত।`;
    repBanner.style.display = "block";
  }

  initUrlParams();
  initTrackerForm();
}

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
      alert("অনুগ্রহ করে ট্র্যাকিং আইডি ও গোপন পিন কোড দিন।");
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
      <div style="background: rgba(220, 38, 38, 0.15); border: 1px solid #dc2626; border-radius: 12px; padding: 2rem; text-align: center; color: #fca5a5;">
        <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">⚠️</div>
        <h3>কোনো তথ্য মেলেনি!</h3>
        <p style="margin-top: 0.5rem;">ট্র্যাকিং কেস আইডি ও গোপন পিন পুনরায় যাচাই করুন।</p>
      </div>
    `;
    resultContainer.style.display = "block";
    return;
  }

  let statusBadge = "";
  if (r.status === "verified") statusBadge = `<span class="badge badge-verified">✓ সত্যতা নিশ্চিত (Verified)</span>`;
  else if (r.status === "fake") statusBadge = `<span class="badge badge-fake">✕ প্রমাণিত ভুয়া (Fake)</span>`;
  else if (r.status === "partially_true") statusBadge = `<span class="badge badge-partially">⚖️ সম্পূর্ণ সঠিক নয় (আংশিক সত্য)</span>`;
  else statusBadge = `<span class="badge badge-investigating">⏳ তদন্তাধীন (Under Investigation)</span>`;

  resultContainer.innerHTML = `
    <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 16px; padding: 2rem; margin-top: 1.5rem;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1.25rem; margin-bottom: 1.25rem;">
        <div>
          <span style="font-size: 0.82rem; color: var(--text-muted);">মামলা / রিপোর্ট ট্র্যাকিং আইডি</span>
          <h2 style="font-size: 1.55rem; font-weight: 800; color: #fff; margin-top: 2px;">${r.id}</h2>
          <div style="margin-top: 0.4rem; display: flex; gap: 0.5rem;">${statusBadge}</div>
        </div>
        <div style="text-align: right;">
          <span style="font-size: 0.82rem; color: var(--text-muted);">দাখিলের তারিখ ও সময়</span>
          <div style="font-weight: 700; color: #cbd5e1;">${r.date} (${r.time})</div>
          <div style="font-size: 0.8rem; color: #38bdf8;">ঘটনাস্থল: ${r.location}</div>
        </div>
      </div>

      <div style="margin-bottom: 1.35rem;">
        <h4 style="font-size: 1.15rem; color: #fff; margin-bottom: 0.4rem;">শিরোনাম: ${r.title}</h4>
        <p style="color: var(--text-secondary); line-height: 1.7; font-size: 0.94rem;">${r.description}</p>
      </div>

      <div style="background:rgba(8,12,22,0.8); border:1px solid var(--border-color); border-radius:10px; padding:1rem; margin-bottom:1.5rem;">
        <div style="font-weight:700; color:#38bdf8; font-size:0.9rem; margin-bottom:4px;">ফরেনসিক রেটিং ও তদন্ত কর্মকর্তার নোট:</div>
        <div style="color:#f8fafc; font-size:0.92rem;">${r.statusNote || 'প্রাথমিক যাচাই সম্পন্ন।'} (সত্যতা স্কোর: ${r.truthScore || 75}%)</div>
      </div>

      <h4 style="font-size: 0.95rem; color: #94a3b8; margin-bottom: 1rem; text-transform: uppercase;">তদন্ত অগ্রগতির টাইমলাইন</h4>
      <div style="display: flex; flex-direction: column; gap: 1.25rem; border-left: 2px solid var(--border-color); padding-left: 1.5rem; margin-left: 0.5rem;">
        <div>
          <h5 style="color: #fff; font-size: 0.95rem;">১. অভিযোগ সফলভাবে গ্রহণ ও এনক্রিপ্টকরণ</h5>
          <p style="font-size: 0.84rem; color: var(--text-muted);">রিপোর্টটি সিস্টেমে সংরক্ষিত ও গোপন পিন কোড ইস্যু করা হয়েছে।</p>
        </div>
        <div>
          <h5 style="color: #fff; font-size: 0.95rem;">২. ডিজিটাল ফরেনসিক ও এআই ফিল্টারিং পরীক্ষা</h5>
          <p style="font-size: 0.84rem; color: var(--text-muted);">ছবি, ভিডিও, অডিও ও পিডিএফ মেটাডাটা বিশ্লেষণ সম্পন্ন হয়েছে।</p>
        </div>
        <div>
          <h5 style="color: #fff; font-size: 0.95rem;">৩. মাঠপর্যায়ে অনুসন্ধান ও সাক্ষ্যপ্রমাণ পর্যালোচনা</h5>
          <p style="font-size: 0.84rem; color: var(--text-muted);">সংশ্লিষ্ট কর্তৃপক্ষ ও স্থানীয় তথ্যসূত্রের সঙ্গে তথ্য ক্রস-ম্যাচিং করা হচ্ছে।</p>
        </div>
        <div>
          <h5 style="color: #fff; font-size: 0.95rem;">৪. চূড়ান্ত সত্যতা রায় ও স্ট্যাটাস প্রকাশ</h5>
          <p style="font-size: 0.84rem; color: var(--text-muted);">${r.statusNote}</p>
        </div>
      </div>
    </div>
  `;
  resultContainer.style.display = "block";
}
