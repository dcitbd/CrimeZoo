/**
 * CRIME ZOO - REPORT & COMPLAINT SUBMISSION ENGINE
 * Requirements:
 * - Documents not strictly mandatory, ANY 1 media/document is sufficient for submission.
 * - If photos selected, minimum 5 to 10 photos required with thumbnail grid preview.
 * - Anti-paste protection on caption with automated AI text detection.
 * - Dispatches email notification to jainal.dcitbd@gmail.com and saiful05333@gmail.com on submit.
 */

document.addEventListener("DOMContentLoaded", function () {
  initReporterToggle();
  initAntiPasteAndAIDetection();
  initMultiMediaInputs();
  initFormSubmission();
});

let selectedReporterType = "anonymous";
let uploadedPhotosList = [];
let uploadedVideoData = "";
let uploadedAudioData = "";
let uploadedPdfData = "";

function initReporterToggle() {
  const anonCard = document.getElementById("toggleAnonymous");
  const identCard = document.getElementById("toggleIdentified");
  const identFields = document.getElementById("identifiedFields");
  if (!anonCard || !identCard) return;

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
        window.showSecurityNotice("কপি করা টেক্সট পেস্ট করা সম্পূর্ণ নিষিদ্ধ! নিজ হাতে সত্য ঘটনা টাইপ করুন।");
      } else {
        alert("কপি করা টেক্সট পেস্ট করা নিষিদ্ধ!");
      }
    });
    inp.addEventListener("drop", (e) => e.preventDefault());
  });

  const AI_MARKERS = [
    "উপসংহারে বলা যায়", "পরিশেষে বলা যায়", "একটি অত্যন্ত গুরুত্বপূর্ণ বিষয় হলো",
    "স্মরণ রাখা প্রয়োজন যে", "উপরোক্ত আলোচনার প্রেক্ষিতে", "সার্বিকভাবে বিবেচনা করলে",
    "in conclusion", "furthermore", "moreover", "it is important to note",
    "delve into", "testament to", "in summary", "as an ai", "chatgpt"
  ];

  captionInput.addEventListener("input", function (e) {
    const rawText = e.target.value;
    const text = rawText.toLowerCase();

    if (text.trim().length < 20) {
      if (aiStatusBox) aiStatusBox.style.display = "none";
      if (submitBtn) submitBtn.disabled = false;
      return;
    }

    let matched = "";
    for (let m of AI_MARKERS) {
      if (text.includes(m.toLowerCase())) {
        matched = m;
        break;
      }
    }

    const bulletMatches = (rawText.match(/^(\*|-|\d+\.)\s+/gm) || []).length;
    if (matched || bulletMatches >= 4) {
      if (aiStatusBox) {
        aiStatusBox.className = "ai-detector-status ai-detected";
        aiStatusBox.style.display = "flex";
        aiStatusText.innerText = `🚨 Site Auto Error: ক্যাপশনটিতে এআই (AI) কৃত্রিম ভাষা ও প্যাটার্ন (${matched || "AI ফরম্যাটিং"}) শনাক্ত হয়েছে! অনুগ্রহ করে নিজের ভাষায় টাইপ করুন।`;
      }
      if (submitBtn) submitBtn.disabled = true;
    } else {
      if (aiStatusBox) {
        aiStatusBox.className = "ai-detector-status ai-clean";
        aiStatusBox.style.display = "flex";
        aiStatusText.innerText = "✓ মানবিক ভাষা বিশ্লেষণ সফল: কোনো কৃত্রিম এআই প্যাটার্ন নেই।";
      }
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}

function initMultiMediaInputs() {
  const photoFile = document.getElementById("photoFileInput");
  const videoFile = document.getElementById("videoFileInput");
  const audioFile = document.getElementById("audioFileInput");
  const pdfFile = document.getElementById("pdfFileInput");

  // Photos: Support 5 to 10 photos minimum if photo is selected
  if (photoFile) {
    photoFile.addEventListener("change", function () {
      uploadedPhotosList = [];
      const grid = document.getElementById("photoThumbGrid");
      const status = document.getElementById("photoPreviewStatus");
      if (!this.files || this.files.length === 0) {
        if (grid) grid.innerHTML = "";
        return;
      }

      const files = Array.from(this.files);
      if (status) {
        if (files.length < 5) {
          status.innerHTML = `<span style="color:#f87171;">⚠️ সতর্কবার্তা: ছবি আপলোড করলে অন্তত ৫ থেকে ১০টি ছবি দিতে হবে (বর্তমানে ${files.length}টি নির্বাচিত)।</span>`;
        } else {
          status.innerHTML = `<span style="color:#34d399;">✓ মোট ${files.length}টি ছবি নির্বাচিত হয়েছে (গ্রহণযোগ্য)।</span>`;
        }
      }

      if (grid) grid.innerHTML = "";
      files.forEach((file, idx) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          uploadedPhotosList.push(e.target.result);
          if (grid) {
            const thumb = document.createElement("div");
            thumb.className = "preview-thumb-mini";
            thumb.style = "width:60px; height:60px; border-radius:6px; overflow:hidden; border:1px solid #38bdf8; display:inline-block; margin:3px;";
            thumb.innerHTML = `<img src="${e.target.result}" style="width:100%; height:100%; object-fit:cover;">`;
            grid.appendChild(thumb);
          }
        };
        reader.readAsDataURL(file);
      });
    });
  }

  if (videoFile) {
    videoFile.addEventListener("change", function () {
      if (this.files && this.files[0]) {
        uploadedVideoData = URL.createObjectURL(this.files[0]);
        const prev = document.getElementById("videoPreviewStatus");
        if (prev) prev.innerText = "✓ ভিডিও ফাইল যুক্ত হয়েছে: " + this.files[0].name;
      }
    });
  }

  if (audioFile) {
    audioFile.addEventListener("change", function () {
      if (this.files && this.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          uploadedAudioData = e.target.result;
          const prev = document.getElementById("audioPreviewStatus");
          if (prev) prev.innerText = "✓ অডিও রেকর্ড যুক্ত হয়েছে: " + this.files[0].name;
        };
        reader.readAsDataURL(this.files[0]);
      }
    });
  }

  if (pdfFile) {
    pdfFile.addEventListener("change", function () {
      if (this.files && this.files[0]) {
        uploadedPdfData = this.files[0].name;
        const prev = document.getElementById("pdfPreviewStatus");
        if (prev) prev.innerText = "✓ পিডিএফ দলিল যুক্ত হয়েছে: " + this.files[0].name;
      }
    });
  }
}

function initFormSubmission() {
  const form = document.getElementById("crimeReportForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("reportTitle").value.trim();
    const category = document.getElementById("reportCategory").value;
    const location = document.getElementById("reportDistrict").value.trim();
    const description = document.getElementById("reportDescription").value.trim();

    const photoLink = (document.getElementById("photoUrlInput")?.value || "").trim();
    const videoLink = (document.getElementById("videoUrlInput")?.value || "").trim();
    const audioLink = (document.getElementById("audioUrlInput")?.value || "").trim();
    const pdfLink = (document.getElementById("pdfUrlInput")?.value || "").trim();

    // Check photo count requirement: If photos provided via file input, must be 5 to 10 minimum
    const photoFileInput = document.getElementById("photoFileInput");
    if (photoFileInput && photoFileInput.files && photoFileInput.files.length > 0) {
      if (photoFileInput.files.length < 5) {
        alert("⚠️ নিয়ম: ছবি আপলোড করলে অন্তত ৫ থেকে ১০টি ছবি সংযুক্ত করতে হবে!");
        return;
      }
    }

    const hasAnyMedia = uploadedPhotosList.length > 0 || photoLink || uploadedVideoData || videoLink || uploadedAudioData || audioLink || uploadedPdfData || pdfLink;
    if (!hasAnyMedia) {
      alert("অনুগ্রহ করে যেকোনো এক প্রকার ডকুমেন্টস (ছবি, ভিডিও, অডিও অথবা পিডিএফ) সংযুক্ত করুন।");
      return;
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const caseId = `CZ-2026-${randomNum}`;
    const secretPin = Math.floor(1000 + Math.random() * 9000).toString();

    let reporterName = "বেনামি হুইসেলব্লোয়ার";
    let reporterPhone = "জিরো-লগ এনক্রিপ্টেড";
    if (selectedReporterType === "identified") {
      reporterName = (document.getElementById("reporterName")?.value || "").trim() || "সচেতন নাগরিক";
      reporterPhone = (document.getElementById("reporterPhone")?.value || "").trim() || "সংরক্ষিত";
    }

    // Handle Photos gallery
    const photosGallery = uploadedPhotosList.length > 0 ? uploadedPhotosList : (photoLink ? [photoLink] : []);
    const mainPhoto = photosGallery.length > 0 ? photosGallery[0] : "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=900&q=80";

    const finalVideo = uploadedVideoData || videoLink || "";
    const finalAudio = uploadedAudioData || audioLink || "";
    const finalPdf = uploadedPdfData || pdfLink || "";

    const now = new Date();
    const bnDate = now.toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" });
    const bnTime = now.toLocaleTimeString("bn-BD", { hour: "numeric", minute: "numeric" });

    const newReport = {
      id: caseId,
      pin: secretPin,
      title,
      category,
      location,
      reporterType: selectedReporterType,
      reporterName,
      reporterPhone,
      date: bnDate,
      time: bnTime,
      timestamp: Date.now(),
      status: "investigating",
      truthScore: 78,
      statusNote: "রিপোর্ট ও প্রমাণাদি ডাটাবেজে গৃহীত হয়েছে। ফরেনসিক অডিট চলমান।",
      views: 1,
      likes: 0,
      mediaType: finalVideo ? "video" : (finalPdf ? "pdf" : (finalAudio ? "audio" : "photo")),
      mediaUrl: mainPhoto,
      photosList: photosGallery,
      videoUrl: finalVideo,
      audioUrl: finalAudio,
      pdfUrl: finalPdf,
      pdfSummary: finalPdf ? `দালিলিক প্রমাণ (${finalPdf}): সুরক্ষার স্বার্থে শুধুমাত্র প্রিভিউ এবং পাঠযোগ্য।` : "",
      description,
      evidence: "মাল্টি-মিডিয়া ডসিয়ার সংরক্ষিত।",
      comments: []
    };

    StorageManager.addReport(newReport);

    // Dispatch Email Notification to jainal.dcitbd@gmail.com and saiful05333@gmail.com
    if (window.MailerService) {
      MailerService.sendNotification("NEW_CRIME_REPORT", `নতুন রিপোর্ট দাখিল: ${caseId} - ${title}`, {
        "কেস আইডি": caseId,
        "গোপন পিন": secretPin,
        "শিরোনাম": title,
        "ক্যাটাগরি": category,
        "ঘটনাস্থল": location,
        "রিপোর্টারের ধরন": selectedReporterType === "anonymous" ? "বেনামি অভিযোগ" : `পরিচয়যুক্ত (${reporterName})`,
        "সংযুক্ত মিডিয়া": `ছবি: ${photosGallery.length}টি, ভিডিও: ${finalVideo ? "হ্যাঁ" : "না"}, অডিও: ${finalAudio ? "হ্যাঁ" : "না"}, PDF: ${finalPdf || "না"}`
      });
    }

    const modal = document.getElementById("submitSuccessModal");
    if (modal) {
      document.getElementById("resCaseId").innerText = caseId;
      document.getElementById("resPin").innerText = secretPin;
      modal.classList.add("active");
    }
  });
}
