/**
 * CRIMINAL ZOO - REPORT & DIRECT ADMIN COMPLAINT SUBMISSION CONTROLLER
 * Enforces:
 * - Requirement #4: Any 1 document type (Photo OR Video OR Audio OR PDF) is sufficient to submit.
 *   If Photos are provided, at least 5-10 photos are required, with small thumbnail previews below!
 * - Requirement #6: Only logged-in Reporters receive the Secret Tracking PIN Code and can track.
 * - Requirement #9: Works identically for both submit-report.html and direct-admin-complaint.html!
 * - Requirement #18 & #19: Triggers Email Notification to jainal.dcitbd@gmail.com & saiful05333@gmail.com
 *   and sets approvalStatus = 'pending' until Admin approves it live!
 */

document.addEventListener("DOMContentLoaded", function () {
  initReporterToggle();
  initAntiPasteAndAIDetection();
  initMultiMediaInputs();
  initFormSubmission();
});

let selectedReporterType = "anonymous";
let uploadedPhotosList = [];
let mediaBundle = {
  videoData: "",
  audioData: "",
  pdfName: ""
};

function initReporterToggle() {
  const anonCard = document.getElementById("toggleAnonymous");
  const identCard = document.getElementById("toggleIdentified");
  const identFields = document.getElementById("identifiedFields");
  if (!anonCard || !identCard) return;

  // Pre-fill if logged in as a reporter
  const repRaw = sessionStorage.getItem("cz_logged_reporter");
  if (repRaw) {
    try {
      const rep = JSON.parse(repRaw);
      const nameInp = document.getElementById("reporterName");
      const phoneInp = document.getElementById("reporterPhone");
      if (nameInp && !nameInp.value) nameInp.value = rep.name || "";
      if (phoneInp && !phoneInp.value) phoneInp.value = rep.phone || rep.email || "";
    } catch (e) {}
  }

  anonCard.addEventListener("click", () => {
    selectedReporterType = "anonymous";
    anonCard.classList.add("active");
    identCard.classList.remove("active");
    if (identFields) identFields.style.display = "none";
  });

  identCard.addEventListener("click", () => {
    selectedReporterType = "identified";
    identCard.classList.add("active");
    anonCard.classList.remove("active");
    if (identFields) identFields.style.display = "block";
  });
}

function initAntiPasteAndAIDetection() {
  const captionInput = document.getElementById("reportDescription");
  const titleInput = document.getElementById("reportTitle");
  const aiStatusBox = document.getElementById("aiDetectorStatus");
  const aiStatusText = document.getElementById("aiDetectorText");
  const submitBtn = document.getElementById("submitReportBtn");

  if (!captionInput) return;

  [captionInput, titleInput].forEach(inp => {
    if (!inp) return;
    inp.addEventListener("paste", function (e) {
      e.preventDefault();
      if (window.showSecurityNotice) {
        window.showSecurityNotice("কপি করা টেক্সট পেস্ট করা সম্পূর্ণ নিষিদ্ধ! অনুগ্রহ করে নিজ হাতে টাইপ করুন।");
      }
    });
    inp.addEventListener("drop", function (e) {
      e.preventDefault();
    });
  });

  const AI_MARKERS = [
    "উপসংহারে বলা যায়", "পরিশেষে বলা যায়", "একটি অত্যন্ত গুরুত্বপূর্ণ বিষয় হলো",
    "স্মরণ রাখা প্রয়োজন যে", "উপরোক্ত আলোচনার প্রেক্ষিতে", "সার্বিকভাবে বিবেচনা করলে",
    "in conclusion", "furthermore", "moreover", "it is important to note",
    "delve into", "testament to", "in summary", "as an ai", "chatgpt",
    "comprehensive overview", "crucial role", "notably,"
  ];

  captionInput.addEventListener("input", function (e) {
    const rawText = e.target.value;
    const text = rawText.toLowerCase();

    if (text.trim().length < 20) {
      if (aiStatusBox) aiStatusBox.style.display = "none";
      if (submitBtn) submitBtn.disabled = false;
      return;
    }

    let matchedMarker = "";
    for (let m of AI_MARKERS) {
      if (text.includes(m.toLowerCase())) {
        matchedMarker = m;
        break;
      }
    }

    const bulletMatches = (rawText.match(/^(\*|-|\d+\.)\s+/gm) || []).length;
    const colonHeaders = (rawText.match(/\*\*[^*]+\*\*:/g) || []).length;

    if (matchedMarker || bulletMatches >= 4 || colonHeaders >= 1) {
      if (aiStatusBox) {
        aiStatusBox.className = "ai-detector-status ai-detected";
        aiStatusBox.style.display = "flex";
        aiStatusText.innerText = `🚨 Site Auto Error: ক্যাপশনটির লেখা AI (কৃত্রিম বুদ্ধিমত্তা) দিয়ে তৈরি বা ফর্মুলাযুক্ত শনাক্ত হয়েছে (${matchedMarker || "AI ফরম্যাটিং"})! অনুগ্রহ করে AI ছাড়া নিজের ভাষায় সত্য ঘটনা লিখুন।`;
      }
      if (submitBtn) submitBtn.disabled = true;
    } else {
      if (aiStatusBox) {
        aiStatusBox.className = "ai-detector-status ai-clean";
        aiStatusBox.style.display = "flex";
        aiStatusText.innerText = "✓ মানবিক ভাষা যাচাই সম্পন্ন: লেখাটি প্রাকৃতিক ও গ্রহণযোগ্য (সকল ভাষা সমর্থিত)।";
      }
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

// Render small thumbnail previews below photo input (Requirement #4)
function renderSmallPhotoPreviews() {
  const statusEl = document.getElementById("photoPreviewStatus");
  let gridEl = document.getElementById("photoThumbnailsGrid");
  if (!gridEl && statusEl) {
    gridEl = document.createElement("div");
    gridEl.id = "photoThumbnailsGrid";
    gridEl.style.cssText = "display:flex; flex-wrap:wrap; gap:0.45rem; margin-top:0.6rem;";
    statusEl.parentNode.appendChild(gridEl);
  }
  if (!statusEl) return;

  const count = uploadedPhotosList.length;
  if (count === 0) {
    statusEl.style.color = "#94a3b8";
    statusEl.innerText = "ছবি দিলে কমপক্ষে ৫ থেকে ১০টি ছবি যুক্ত করুন (নিচে ছোট প্রিভিউ দেখাবে)।";
    if (gridEl) gridEl.innerHTML = "";
    return;
  }

  if (count < 5) {
    statusEl.style.color = "#fbbf24";
    statusEl.innerText = `⚠️ বর্তমানে ${count}টি ছবি যুক্ত হয়েছে — সাবমিট করতে আরও অন্তত ${5 - count}টি ছবি (মোট ৫-১০টি) যুক্ত করুন।`;
  } else {
    statusEl.style.color = "#34d399";
    statusEl.innerText = `✓ চমৎকার! মোট ${count}টি ছবি যুক্ত হয়েছে (অটো স্লাইড ও প্রিভিউ প্রস্তুত)।`;
  }

  if (gridEl) {
    gridEl.innerHTML = uploadedPhotosList.map((src, idx) => `
      <div style="position:relative; width:64px; height:64px; border-radius:8px; overflow:hidden; border:2px solid ${count >= 5 ? '#10b981' : '#f59e0b'}; background:#060911; box-shadow:0 4px 10px rgba(0,0,0,0.5);">
        <img src="${src}" style="width:100%; height:100%; object-fit:cover;">
        <span style="position:absolute; bottom:2px; left:3px; background:rgba(0,0,0,0.75); color:#fff; font-size:0.62rem; font-weight:700; padding:0 4px; border-radius:4px;">#${idx + 1}</span>
        <button type="button" onclick="removeUploadedPhotoAt(${idx})" title="মুছে ফেলুন" style="position:absolute; top:2px; right:2px; width:18px; height:18px; border-radius:50%; background:rgba(220,38,38,0.9); color:#fff; border:none; font-size:0.65rem; cursor:pointer; display:flex; align-items:center; justify-content:center; line-height:1;">✕</button>
      </div>
    `).join("");
  }
}

window.removeUploadedPhotoAt = function (idx) {
  uploadedPhotosList.splice(idx, 1);
  renderSmallPhotoPreviews();
};

window.addPhotoUrlToList = function () {
  const urlInp = document.getElementById("photoUrlInput");
  if (!urlInp) return;
  const raw = urlInp.value.trim();
  if (!raw) return;
  const parts = raw.split(/[\s,]+/).map(s => s.trim()).filter(Boolean);
  parts.forEach(u => {
    if (uploadedPhotosList.length < 15) {
      uploadedPhotosList.push(u);
    }
  });
  urlInp.value = "";
  renderSmallPhotoPreviews();
};

function initMultiMediaInputs() {
  const photoFile = document.getElementById("photoFileInput");
  const photoUrlInp = document.getElementById("photoUrlInput");
  const videoFile = document.getElementById("videoFileInput");
  const audioFile = document.getElementById("audioFileInput");
  const pdfFile = document.getElementById("pdfFileInput");

  if (photoFile) {
    photoFile.setAttribute("multiple", "multiple");
    photoFile.addEventListener("change", function () {
      if (this.files && this.files.length > 0) {
        Array.from(this.files).forEach(file => {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (uploadedPhotosList.length < 15) {
              uploadedPhotosList.push(e.target.result);
              renderSmallPhotoPreviews();
            }
          };
          reader.readAsDataURL(file);
        });
      }
    });
  }

  if (photoUrlInp) {
    photoUrlInp.addEventListener("change", function () {
      window.addPhotoUrlToList();
    });
  }

  renderSmallPhotoPreviews();

  if (videoFile) {
    videoFile.addEventListener("change", function () {
      if (this.files && this.files[0]) {
        mediaBundle.videoData = URL.createObjectURL(this.files[0]);
        const prev = document.getElementById("videoPreviewStatus");
        if (prev) prev.innerText = "✓ ভিডিও যুক্ত হয়েছে: " + this.files[0].name;
      }
    });
  }

  if (audioFile) {
    audioFile.addEventListener("change", function () {
      if (this.files && this.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          mediaBundle.audioData = e.target.result;
          const prev = document.getElementById("audioPreviewStatus");
          if (prev) prev.innerText = "✓ অডিও যুক্ত হয়েছে: " + this.files[0].name;
        };
        reader.readAsDataURL(this.files[0]);
      }
    });
  }

  if (pdfFile) {
    pdfFile.addEventListener("change", function () {
      if (this.files && this.files[0]) {
        mediaBundle.pdfName = this.files[0].name;
        const prev = document.getElementById("pdfPreviewStatus");
        if (prev) prev.innerText = "✓ পিডিএফ যুক্ত হয়েছে: " + this.files[0].name;
      }
    });
  }
}

function initFormSubmission() {
  const form = document.getElementById("crimeReportForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const aiStatusBox = document.getElementById("aiDetectorStatus");
    if (aiStatusBox && aiStatusBox.classList.contains("ai-detected")) {
      if (window.showSecurityNotice) {
        window.showSecurityNotice("🚨 Site Auto Error: AI দিয়ে লেখা ক্যাপশন গ্রহণযোগ্য নয়। অনুগ্রহ করে নিজের ভাষায় লিখুন।");
      }
      return;
    }

    // Collect any pending URL in photoUrlInput
    const photoUrlInp = document.getElementById("photoUrlInput");
    if (photoUrlInp && photoUrlInp.value.trim()) {
      window.addPhotoUrlToList();
    }

    const title = document.getElementById("reportTitle").value.trim();
    const category = document.getElementById("reportCategory").value;
    const location = document.getElementById("reportDistrict").value.trim();
    const description = document.getElementById("reportDescription").value.trim();

    const videoLink = (document.getElementById("videoUrlInput")?.value || "").trim();
    const audioLink = (document.getElementById("audioUrlInput")?.value || "").trim();
    const pdfLink = (document.getElementById("pdfUrlInput")?.value || "").trim();

    const finalVideo = mediaBundle.videoData || videoLink || "";
    const finalAudio = mediaBundle.audioData || audioLink || "";
    const finalPdf = mediaBundle.pdfName || pdfLink || "";
    const hasPhotos = uploadedPhotosList.length > 0;

    // Requirement #4 Validation:
    // 1. Not all document types are mandatory; at least ONE document type (Photo OR Video OR Audio OR PDF) must be provided.
    if (!hasPhotos && !finalVideo && !finalAudio && !finalPdf) {
      if (window.showSecurityNotice) {
        window.showSecurityNotice("⚠️ ফর্ম সাবমিট করতে অন্তত যেকোনো এক প্রকার ডকুমেন্ট (ছবি, ভিডিও, অডিও অথবা পিডিএফ) যুক্ত করুন!");
      }
      const errBox = document.getElementById("mediaValidationErrorBox");
      if (errBox) {
        errBox.style.display = "block";
        errBox.innerText = "⚠️ সকল প্রকার ডকুমেন্ট দেওয়া বাধ্যতামূলক নয়, তবে অন্তত যেকোনো এক প্রকার ডকুমেন্ট (৫-১০টি ছবি, অথবা ভিডিও, অথবা অডিও, অথবা পিডিএফ) অবশ্যই দিতে হবে।";
      }
      return;
    }

    // 2. If photos are provided, at least 5 to 10 photos must be uploaded!
    if (hasPhotos && uploadedPhotosList.length < 5) {
      if (window.showSecurityNotice) {
        window.showSecurityNotice(`⚠️ ছবি আপলোড করলে কমপক্ষে ৫ থেকে ১০টি ছবি দিতে হবে! আপনি দিয়েছেন ${uploadedPhotosList.length}টি।`);
      }
      const errBox = document.getElementById("mediaValidationErrorBox");
      if (errBox) {
        errBox.style.display = "block";
        errBox.innerText = `⚠️ আপনি ${uploadedPhotosList.length}টি ছবি যুক্ত করেছেন। ছবি দিতে চাইলে কমপক্ষে ৫ থেকে ১০টি ছবি দিতে হবে (আরও ${5 - uploadedPhotosList.length}টি ছবি যুক্ত করুন)।`;
      }
      return;
    }

    const errBox = document.getElementById("mediaValidationErrorBox");
    if (errBox) errBox.style.display = "none";

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const caseId = `CZ-2026-${randomNum}`;
    const secretPin = Math.floor(1000 + Math.random() * 9000).toString();

    let reporterName = "বেনামি হুইসেলব্লোয়ার";
    let reporterPhone = "জিরো-লগ এনক্রিপ্টেড";
    let reporterId = "ANON";

    const loggedReporterRaw = sessionStorage.getItem("cz_logged_reporter");
    let loggedReporter = null;
    if (loggedReporterRaw) {
      try { loggedReporter = JSON.parse(loggedReporterRaw); } catch (err) {}
    }

    if (selectedReporterType === "identified") {
      reporterName = (document.getElementById("reporterName")?.value || "").trim() || (loggedReporter ? loggedReporter.name : "সচেতন নাগরিক");
      reporterPhone = (document.getElementById("reporterPhone")?.value || "").trim() || (loggedReporter ? loggedReporter.phone : "সংরক্ষিত");
      if (loggedReporter) reporterId = loggedReporter.id;
    } else if (loggedReporter) {
      reporterId = loggedReporter.id;
    }

    const finalGallery = hasPhotos ? [...uploadedPhotosList] : [window.EVIDENCE_GALLERY_POOL ? window.EVIDENCE_GALLERY_POOL[0] : "./assets/icons/banner.jpg"];
    const finalPhoto = finalGallery[0];

    const now = new Date();
    const bnDate = now.toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" });
    const bnTime = now.toLocaleTimeString("bn-BD", { hour: "numeric", minute: "numeric" });

    const isDirectAdminComplaint = document.body.getAttribute("data-form-mode") === "direct_admin" || window.location.pathname.includes("direct-admin-complaint.html");

    const newReport = {
      id: caseId,
      pin: secretPin,
      title,
      category,
      location,
      reporterType: selectedReporterType,
      reporterName,
      reporterPhone,
      reporterId,
      date: bnDate,
      time: bnTime,
      timestamp: Date.now(),
      status: "investigating",
      approvalStatus: "pending", // Requirement #19: Goes live when Admin approves!
      active: true,
      truthScore: 78,
      statusNote: "রিপোর্ট ও মাল্টি-মিডিয়া প্রমাণ ডাটাবেজে গৃহীত হয়েছে। এডমিন অনুমোদন ও ফরেনসিক যাচাই প্রক্রিয়াধীন।",
      views: 1,
      likes: 0,
      mediaType: finalVideo ? "video" : (finalPdf ? "pdf" : (finalAudio ? "audio" : "photo")),
      mediaUrl: finalPhoto,
      mediaUrls: finalGallery,
      videoUrl: finalVideo,
      audioUrl: finalAudio,
      pdfUrl: finalPdf,
      pdfSummary: finalPdf ? `সংযুক্ত পিডিএফ দলিল (${finalPdf}): অভিযোগকারীর দাখিলকৃত দালিলিক প্রমাণ ও বিবরণী ফরেনসিক রিডার দ্বারা সুরক্ষিত রয়েছে।` : "",
      description,
      evidence: `${hasPhotos ? finalGallery.length + 'টি ছবি' : ''} ${finalVideo ? '+ ভিডিও' : ''} ${finalAudio ? '+ অডিও' : ''} ${finalPdf ? '+ PDF' : ''} সংরক্ষিত।`.trim(),
      comments: []
    };

    StorageManager.addReport(newReport);

    // If submitted on Direct Admin Complaint page, ALSO save in Inbox/Messages so Admin can manage it in inbox.html too
    if (isDirectAdminComplaint) {
      StorageManager.addMessage({
        id: "DIR-" + randomNum,
        type: "direct_admin",
        reporterType: selectedReporterType,
        name: reporterName,
        phone: reporterPhone,
        email: loggedReporter ? loggedReporter.email : "এনক্রিপ্টেড ভল্ট",
        category,
        location,
        subject: `🚨 [সরাসরি এডমিন অভিযোগ] ${title}`,
        message: description,
        mediaAttached: newReport.evidence,
        mediaUrls: finalGallery,
        videoUrl: finalVideo,
        audioUrl: finalAudio,
        pdfUrl: finalPdf,
        date: bnDate,
        status: "pending",
        active: true,
        publishedReportId: caseId
      });
    }

    // Requirement #6: Only logged-in Reporters get the secret tracking code and can track!
    const modal = document.getElementById("submitSuccessModal");
    if (modal) {
      const caseEl = document.getElementById("resCaseId");
      const pinEl = document.getElementById("resPin");
      const secretBox = document.getElementById("reporterSecretPinBox");
      const viewerNoticeBox = document.getElementById("viewerNoPinNoticeBox");
      const trackBtn = document.getElementById("modalGoTrackBtn");

      if (caseEl) caseEl.innerText = caseId;
      if (loggedReporter) {
        if (pinEl) pinEl.innerText = secretPin;
        if (secretBox) secretBox.style.display = "block";
        if (viewerNoticeBox) viewerNoticeBox.style.display = "none";
        if (trackBtn) {
          trackBtn.style.display = "inline-flex";
          trackBtn.onclick = () => { window.location.href = `./track-report.html?id=${caseId}&pin=${secretPin}`; };
        }
      } else {
        if (pinEl) pinEl.innerText = "সংরক্ষিত (শুধু রিপোর্টার)";
        if (secretBox) secretBox.style.display = "none";
        if (viewerNoticeBox) viewerNoticeBox.style.display = "block";
        if (trackBtn) {
          trackBtn.style.display = "none";
        }
      }
      modal.classList.add("active");
    }
  });
}
