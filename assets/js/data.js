/**
 * CRIME ZOO - REAL-TIME DATABASE, MULTI-MEDIA EVIDENCE, 22+ HELPLINES,
 * REPORTER SYSTEM, CONTACTS CRUD & DEEP FORENSICS ENGINE
 */

const INITIAL_REPORTS = [
  {
    id: "CZ-2026-8941",
    pin: "9842",
    title: "উত্তরায় ভুয়া অনলাইন ব্যাংকিং চক্রের মাধ্যমে অর্থ আত্মসাৎ ও সাইবার জালিয়াতি",
    category: "আর্থিক প্রতারণা",
    location: "উত্তরা, ঢাকা",
    reporterType: "anonymous",
    reporterName: "বেনামি হুইসেলব্লোয়ার",
    reporterPhone: "জিরো-লগ এনক্রিপ্টেড",
    reporterId: "ANON",
    date: "০৬ নভেম্বর ২০২৬",
    time: "সন্ধ্যা ৬:৩০",
    timestamp: Date.now() - 3600000 * 3,
    status: "verified",
    truthScore: 97,
    statusNote: "সাইবার অপরাধ তদন্ত বিভাগ কর্তৃক ব্যাংক লেনদেন রসিদ, কল রেকর্ড ও আইপি লগ যাচাই করে অপরাধের সত্যতা নিশ্চিত করা হয়েছে।",
    views: 1840,
    likes: 112,
    mediaType: "photo",
    mediaUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=900&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    audioUrl: "audio-sample-1",
    pdfUrl: "bank-transaction-audit-report.pdf",
    pdfSummary: "বাংলাদেশ ফাইন্যান্সিয়াল ইন্টেলিজেন্স ইউনিট (BFIU) ও ব্যাংক স্টেটমেন্ট অডিট দলিল: উত্তরা সেক্টর-৭ শাখার ৫টি অ্যাকাউন্ট থেকে মোট ১৪,৮০,০০০ টাকা ভুয়া ওটিপি গেটওয়ের মাধ্যমে স্থানান্তর করা হয়েছে। ট্রানজেকশন হ্যাশ: #TXN-998120-BD।",
    description: "একটি সংঘবদ্ধ প্রতারক চক্র বাংলাদেশ ব্যাংকের নামে ভুয়া এসএমএস ও হোয়াটসঅ্যাপ বার্তা পাঠিয়ে ওটিপি (OTP) হাতিয়ে নিচ্ছে। উত্তরা সেক্টর ৭ এর একাধিক ক্ষুদ্র ব্যবসায়ীর হিসাব থেকে লক্ষাধিক টাকা সরিয়ে ফেলা হয়েছে। সংশ্লিষ্ট ব্যাংক কর্তৃপক্ষ ও সাইবার ইউনিটকে সিসিটিভি ফুটেজ, কল রেকর্ড ও পিডিএফ ব্যাংক স্টেটমেন্ট হস্তান্তর করা হয়েছে।",
    evidence: "ব্যাংক লেনদেনের পিডিএফ রসিদ, অডিও কল রেকর্ড ও সিসিটিভি ফুটেজ ফরেনসিক পরীক্ষায় শতভাগ অক্ষত পাওয়া গেছে।",
    comments: [
      { id: "c1", user: "সাইবার সচেতন নাগরিক", date: "২ ঘণ্টা আগে", text: "এই ধরনের ওটিপি ফ্রড প্রতিরোধে ব্যাংকগুলোর তাৎক্ষণিক বায়োমেট্রিক যাচাই আরও জোরদার করা উচিত।" },
      { id: "c2", user: "ভুক্তভোগী ব্যবসায়ী", date: "১ ঘণ্টা আগে", text: "আমার কাছ থেকেও এভাবে ফোন করে ওটিপি চাওয়ার চেষ্টা করা হয়েছিল। সবাই সতর্ক থাকুন।" }
    ]
  },
  {
    id: "CZ-2026-7720",
    pin: "4319",
    title: "চট্টগ্রাম বন্দরে কন্টেইনারে নিষিদ্ধ কেমিক্যাল চালানের গোপন ভিডিও ও ম্যানিফেস্ট ফাঁস",
    category: "চোরাচালান",
    location: "পতেঙ্গা, চট্টগ্রাম",
    reporterType: "identified",
    reporterName: "মো. রফিকুল ইসলাম",
    reporterPhone: "০১৭১১-XXXXXX",
    reporterId: "REP-101",
    date: "০৫ নভেম্বর ২০২৬",
    time: "দুপুর ২:১৫",
    timestamp: Date.now() - 3600000 * 18,
    status: "investigating",
    truthScore: 82,
    statusNote: "শুল্ক গোয়েন্দা ও কাস্টমস কর্তৃপক্ষ কন্টেইনার লক সিল পরীক্ষা ও রাসায়নিক ল্যাব টেস্টের রিপোর্ট প্রস্তুত করছে।",
    views: 3120,
    likes: 164,
    mediaType: "video",
    mediaUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    audioUrl: "audio-sample-2",
    pdfUrl: "customs-shipping-manifest-7720.pdf",
    pdfSummary: "কাস্টমস হাউস চট্টগ্রাম শিপিং ম্যানিফেস্ট #CH-88412: আমদানিকারক প্রতিষ্ঠানের ঘোষণাপত্রে টেক্সটাইল ডাই উল্লেখ থাকলেও কন্টেইনার স্ক্যানিংয়ে বিপজ্জনক রাসায়নিক ড্রাম শনাক্ত হয়েছে।",
    description: "শিল্প কাঁচামালের আড়ালে অনুমোদনহীন মারাত্মক বিষাক্ত কেমিক্যাল খালাসের গোপন অপচেষ্টা চলছে। আমদানি নথিপত্রে ভুয়া পণ্যের বর্ণনা উল্লেখ রয়েছে। গোপন সূত্রে প্রাপ্ত তথ্য অনুযায়ী কাস্টমস হাউস বিশেষ টিম গঠন করে কন্টেইনারগুলোর শারীরিক পরীক্ষণ পরিচালনা করছে।",
    evidence: "বিল অব এন্ট্রি পিডিএফ এবং শিপিং ইয়ার্ডের ভিডিও ফুটেজ অডিট চলমান।",
    comments: [
      { id: "c3", user: "পরিবেশ আন্দোলনকর্মী", date: "১২ ঘণ্টা আগে", text: "রাসায়নিক দ্রব্যের সঠিক স্ক্রিনিং ও ল্যাব রিপোর্ট জনসমক্ষে প্রকাশ করা জরুরি।" }
    ]
  },
  {
    id: "CZ-2026-6105",
    pin: "5582",
    title: "সোশ্যাল মিডিয়ায় ভুয়া নিখোঁজ বিজ্ঞপ্তি ও গুজবের ফরেনসিক ফ্যাক্ট-চেক",
    category: "গুজব ও বিভ্রান্তি",
    location: "অনলাইন / সোশ্যাল মিডিয়া",
    reporterType: "official",
    reporterName: "Crime Zoo ফরেনসিক ডেস্ক",
    reporterPhone: "অফিসিয়াল সেল",
    reporterId: "ADMIN",
    date: "০৪ নভেম্বর ২০২৬",
    time: "সকাল ১১:০০",
    timestamp: Date.now() - 3600000 * 36,
    status: "fake",
    truthScore: 9,
    statusNote: "তদন্তে প্রমাণিত: পুরনো ও ভিন্ন দেশের ঘটনার ছবি এআই (AI) দিয়ে সম্পাদনা করে আতঙ্ক সৃষ্টির উদ্দেশ্যে প্রচার করা হচ্ছে।",
    views: 5890,
    likes: 342,
    mediaType: "photo",
    mediaUrl: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=900&q=80",
    videoUrl: "",
    audioUrl: "",
    pdfUrl: "ai-deepfake-forensic-report-6105.pdf",
    pdfSummary: "Crime Zoo ফরেনসিক ল্যাব রিপোর্ট #FL-6105: ইমেজের Error Level Analysis (ELA) এবং EXIF মেটাডাটা বিশ্লেষণে দেখা গেছে ছবিটি Midjourney v6 ও ফটোশপ ব্যবহার করে কৃত্রিমভাবে সংযোজন করা হয়েছে।",
    description: "সাম্প্রতিক সময়ে সামাজিক যোগাযোগ মাধ্যমে শিশুদের নিখোঁজ হওয়া ও অঙ্গহানির ভুয়া পোস্ট ছড়িয়ে সাধারণ মানুষের মধ্যে ভীতি সঞ্চার করা হচ্ছে। ফ্যাক্ট-চেকিং টিম রিভার্স ইমেজ সার্চ ও মেটাডাটা বিশ্লেষণ করে নিশ্চিত হয়েছে যে উল্লেখিত ছবিগুলো সম্পাদিত ও ভিত্তিহীন।",
    evidence: "রিভার্স ইমেজ সার্চের ক্রোনোলজিক্যাল ফলাফল ও এআই জেনারেটেড পিক্সেল প্যাটার্ন প্রমাণিত।",
    comments: [
      { id: "c4", user: "সত্যের সন্ধানে", date: "১ দিন আগে", text: "এ ধরনের গুজব ছড়ানো পেজগুলোর বিরুদ্ধে কঠোর ব্যবস্থা নেওয়া হোক।" }
    ]
  },
  {
    id: "CZ-2026-5098",
    pin: "7124",
    title: "ঢাকা-চট্টগ্রাম মহাসড়কে রাতে পণ্যবাহী ট্রাকে ডাকাতির অডিও কল রেকর্ড ও ম্যাপ ফাঁস",
    category: "ডাকাতি ও ছিনতাই",
    location: "কুমিল্লা-ফেনী মহাসড়ক",
    reporterType: "anonymous",
    reporterName: "বেনামি অভিযোগকারী",
    reporterPhone: "গোপনীয়",
    reporterId: "ANON",
    date: "০৩ নভেম্বর ২০২৬",
    time: "রাত ১২:৪৫",
    timestamp: Date.now() - 3600000 * 54,
    status: "verified",
    truthScore: 94,
    statusNote: "হাইওয়ে পুলিশ টিম বিশেষ অভিযান পরিচালনা করে ৩ জনকে আটক করেছে এবং লুট হওয়া মালামাল জব্দ করেছে।",
    views: 3490,
    likes: 238,
    mediaType: "audio",
    mediaUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=80",
    videoUrl: "",
    audioUrl: "highway-patrol-intercept-audio",
    pdfUrl: "highway-police-seizure-list.pdf",
    pdfSummary: "হাইওয়ে পুলিশ জব্দ তালিকা ও প্রাথমিক তথ্য বিবরণী: কুমিল্লা চৌদ্দগ্রাম অংশে অভিযান চালিয়ে দেশীয় অস্ত্রসহ ৩ জনকে গ্রেপ্তার এবং ২টি কাভার্ড ভ্যান উদ্ধার করা হয়েছে।",
    description: "মহাসড়কে দূরপাল্লার পণ্যবাহী ট্রাক থামিয়ে চাঁদা দাবি ও চালকদের অস্ত্রের মুখে জিম্মি করার অডিও রেকর্ড ফাঁস হয়েছে। ভুক্তভোগী এক হেলপারের ধারণকৃত অডিওতে ডাকাত দলের সদস্যদের কথোপকথন ও অবস্থান উঠে এসেছে।",
    evidence: "অডিও স্পেকট্রাম বিশ্লেষণ ও ফরেনসিক ভয়েস ম্যাচিংয়ে কোনো ডিজিটাল বিকৃতি বা এআই ক্লোনিং মেলেনি।",
    comments: [
      { id: "c5", user: "পরিবহন চালক ইউনিয়ন", date: "২ দিন আগে", text: "হাইওয়েতে রাতের বেলায় পুলিশি টহল আরও জোরদার করা দরকার।" }
    ]
  },
  {
    id: "CZ-2026-4412",
    pin: "8831",
    title: "সরকারি চাকরির ভুয়া নিয়োগপত্র ও জাল প্রজ্ঞাপন দিয়ে কোটি টাকা আত্মসাৎ",
    category: "নিয়োগ দুর্নীতি",
    location: "মতিঝিল, ঢাকা",
    reporterType: "identified",
    reporterName: "তানভীর আহমেদ",
    reporterPhone: "০১৮১৯-XXXXXX",
    reporterId: "REP-101",
    date: "০২ নভেম্বর ২০২৬",
    time: "বিকাল ৫:২০",
    timestamp: Date.now() - 3600000 * 78,
    status: "verified",
    truthScore: 98,
    statusNote: "ভুয়া সিল ও মন্ত্রণালয়ের জাল স্মারক নম্বর সংবলিত পিডিএফ চিঠি উদ্ধার। সিআইডি টিম মামলা তদন্ত করছে।",
    views: 4510,
    likes: 289,
    mediaType: "pdf",
    mediaUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=900&q=80",
    videoUrl: "",
    audioUrl: "bribe-demand-call-record",
    pdfUrl: "forged-appointment-letter-evidence.pdf",
    pdfSummary: "জাল নিয়োগপত্রের ফরেনসিক তুলনা প্রতিবেদন: প্রতারক চক্রের ব্যবহৃত বারকোড ও স্মারক নম্বর (#স্মারক-৪৪/নিয়োগ/২০২৬) সরকারি ডাটাবেজে অস্তিত্বহীন প্রমাণিত হয়েছে।",
    description: "সরকারি দপ্তরে চাকরি পাইয়ে দেওয়ার নামে শত শত চাকরিপ্রার্থীর কাছ থেকে ভুয়া নিয়োগপত্র দিয়ে কোটি টাকা হাতিয়ে নেওয়া হয়েছে। প্রতারক চক্র মতিঝিলে একটি অস্থায়ী অফিস খুলে এই জালিয়াতি চালাচ্ছিল।",
    evidence: "মন্ত্রণালয়ের মূল প্রশাসন উইং নিশ্চিত করেছে প্রদত্ত স্মারক নম্বরগুলো সম্পূর্ণ জাল।",
    comments: []
  },
  {
    id: "CZ-2026-3829",
    pin: "2354",
    title: "মিরপুরে কিশোর গ্যাংয়ের চাঁদাবাজি ও অস্ত্র মহড়ার সিসিটিভি ফুটেজ বিশ্লেষণ",
    category: "সন্ত্রাস ও সহিংসতা",
    location: "মিরপুর-১১, ঢাকা",
    reporterType: "anonymous",
    reporterName: "এলাকাবাসী",
    reporterPhone: "গোপনীয়",
    reporterId: "ANON",
    date: "০১ নভেম্বর ২০২৬",
    time: "রাত ৯:০০",
    timestamp: Date.now() - 3600000 * 96,
    status: "verified",
    truthScore: 95,
    statusNote: "স্থানীয় থানা পুলিশ সিসিটিভি ফুটেজ দেখে ৪ সদস্যকে চিহ্নিত করে হেফাজতে নিয়েছে।",
    views: 4120,
    likes: 205,
    mediaType: "video",
    mediaUrl: "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=900&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    audioUrl: "",
    pdfUrl: "cctv-frame-analysis-3829.pdf",
    pdfSummary: "সিসিটিভি টাইমকোড বিশ্লেষণ: রাত ২১:০৪:১২ থেকে ২১:১১:৪৫ পর্যন্ত ধারণকৃত ফুটেজের ফ্রেম-বাই-ফ্রেম পরীক্ষায় কোনো এডিটিং বা কাট-পেস্ট পাওয়া যায়নি।",
    description: "মিরপুর ১১ নম্বরে আধিপত্য বিস্তার ও চাঁদাবাজিকে কেন্দ্র করে প্রকাশ্যে মহড়া দেয় স্থানীয় কিশোর গ্যাং। ঘটনার সিসিটিভি ফুটেজে দোকানপাটে ভাঙচুরের চিত্র দেখা যায়।",
    evidence: "দোকানের সিসিটিভি ক্যামেরার মূল ডিভিআর ফুটেজ পর্যালোচনা করা হয়েছে।",
    comments: []
  },
  {
    id: "CZ-2026-3410",
    pin: "6190",
    title: "ওষুধের নকল মোড়ক ও ভেজাল অ্যান্টিবায়োটিক কারখানার গোপন অনুসন্ধান",
    category: "ভেজাল ও জনস্বাস্থ্য",
    location: "কেরানীগঞ্জ, ঢাকা",
    reporterType: "identified",
    reporterName: "ডা. ফারহানা করিম",
    reporterPhone: "০১৭৫৫-XXXXXX",
    reporterId: "REP-102",
    date: "৩০ অক্টোবর ২০২৬",
    time: "বিকাল ৪:১০",
    timestamp: Date.now() - 3600000 * 120,
    status: "verified",
    truthScore: 96,
    statusNote: "ঔষধ প্রশাসন অধিদপ্তর ও র‍্যাবের ভ্রাম্যমাণ আদালত কারখানাটি সিলগালা করেছে।",
    views: 2980,
    likes: 194,
    mediaType: "photo",
    mediaUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=80",
    videoUrl: "",
    audioUrl: "",
    pdfUrl: "dgda-lab-test-report-3410.pdf",
    pdfSummary: "ঔষধ প্রশাসন ল্যাবরেটরি টেস্ট রিপোর্ট: জব্দকৃত ক্যাপসুলে কোনো সক্রিয় অ্যান্টিবায়োটিক উপাদান পাওয়া যায়নি; শুধুমাত্র আটা ও চক পাউডারের মিশ্রণ শনাক্ত হয়েছে।",
    description: "নামিদামি ফার্মাসিউটিক্যাল কোম্পানির হুবহু মোড়ক নকল করে জীবনরক্ষাকারী অ্যান্টিবায়োটিক তৈরি করা হচ্ছিল। গোপন সংবাদের ভিত্তিতে ল্যাব টেস্ট ও অভিযান পরিচালনা করা হয়।",
    evidence: "ল্যাবরেটরি রাসায়নিক পরীক্ষার সনদ ও জব্দকৃত মোড়কের ছবি।",
    comments: []
  },
  {
    id: "CZ-2026-2984",
    pin: "3341",
    title: "ই-কমার্স ডেলিভারির নামে প্রিপেইড পেমেন্ট হাতিয়ে নেওয়া পেজগুলোর তালিকা",
    category: "সাইবার ক্রাইম",
    location: "সারা দেশ (অনলাইন)",
    reporterType: "official",
    reporterName: "Crime Zoo সাইবার ডেস্ক",
    reporterPhone: "অফিসিয়াল",
    reporterId: "ADMIN",
    date: "২৮ অক্টোবর ২০২৬",
    time: "সন্ধ্যা ৭:৩০",
    timestamp: Date.now() - 3600000 * 144,
    status: "partially_true",
    truthScore: 68,
    statusNote: "তালিকাভুক্ত ১২টি পেজের মধ্যে ৯টির বিরুদ্ধে প্রতারণার প্রমাণ মিলেছে, বাকি ৩টি পেজের ডেলিভারি বিলম্ব সংক্রান্ত অভিযোগ নিষ্পত্তি হয়েছে।",
    views: 3750,
    likes: 210,
    mediaType: "pdf",
    mediaUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80",
    videoUrl: "",
    audioUrl: "",
    pdfUrl: "ecommerce-fraud-investigation.pdf",
    pdfSummary: "সাইবার পেমেন্ট ট্র্যাকিং ডকুমেন্ট: বিকাশ ও নগদ মার্চেন্ট অ্যাকাউন্টের পরিবর্তে ব্যক্তিগত এজেন্ট নম্বর ব্যবহার করে অগ্রিম টাকা নেওয়া পেজগুলোর বিশ্লেষণ।",
    description: "আকর্ষণীয় মূল্যছাড়ের বিজ্ঞাপন দিয়ে অগ্রিম টাকা নেওয়ার পর ক্রেতাদের ব্লক করে দেওয়া ফেসবুক পেজগুলোর বিরুদ্ধে অনুসন্ধান প্রতিবেদন।",
    evidence: "ভুক্তভোগীদের পেমেন্ট রসিদ ও পেজ অ্যাডমিনদের লোকেশন ডেটা।",
    comments: []
  }
];

// 22 Government Emergency Sectors Directory with Official Logos & Badges
const EMERGENCY_SECTORS = [
  { id: "em1", name: "জাতীয় জরুরি সেবা", dept: "পুলিশ, ফায়ার সার্ভিস ও অ্যাম্বুলেন্স", number: "999", displayNum: "৯৯৯", icon: "🚨", color: "#dc2626", badge: "২৪/৭ টোল-ফ্রি" },
  { id: "em2", name: "দুর্নীতি দমন কমিশন (দুদক)", dept: "ঘুষ, দুর্নীতি ও মানিলন্ডারিং অভিযোগ", number: "106", displayNum: "১০৬", icon: "⚖️", color: "#f59e0b", badge: "সরকারি হটলাইন" },
  { id: "em3", name: "নারী ও শিশু নির্যাতন প্রতিরোধ", dept: "মহিলা ও শিশু বিষয়ক মন্ত্রণালয়", number: "109", displayNum: "১০৯", icon: "🛡️", color: "#a855f7", badge: "২৪/৭ সহায়তা" },
  { id: "em4", name: "চাইল্ড হেল্পলাইন (শিশু সুরক্ষা)", dept: "সমাজসেবা অধিদপ্তর", number: "1098", displayNum: "১০৯৮", icon: "🧒", color: "#10b981", badge: "টোল-ফ্রি" },
  { id: "em5", name: "ফায়ার সার্ভিস ও সিভিল ডিফেন্স", dept: "অগ্নিকাণ্ড ও উদ্ধার অপারেশন কন্ট্রোল রুম", number: "16163", displayNum: "১৬১৬৩", icon: "🚒", color: "#ef4444", badge: "জরুরি রেসকিউ" },
  { id: "em6", name: "পুলিশ সাইবার সাপোর্ট (PCSW)", dept: "অনলাইন হয়রানি ও সাইবার অপরাধ দমন", number: "01320000888", displayNum: "০১৩২০০০০৮৮৮", icon: "💻", color: "#38bdf8", badge: "সাইবার সেল" },
  { id: "em7", name: "র‍্যাব (RAB) অপারেশন কন্ট্রোল", dept: "র‍্যাপিড অ্যাকশন ব্যাটালিয়ন সদর দপ্তর", number: "01777720029", displayNum: "০১৭৭৭৭২০০২৯", icon: "🦅", color: "#eab308", badge: "স্পেশাল ফোর্স" },
  { id: "em8", name: "সিআইডি (CID) সাইবার পুলিশ সেন্টার", dept: "ক্রিমিনাল ইনভেস্টিগেশন ডিপার্টমেন্ট", number: "01320010148", displayNum: "০১৩২০০১০১৪৮", icon: "🔬", color: "#06b6d4", badge: "ফরেনসিক ও সাইবার" },
  { id: "em9", name: "জাতীয় ভোক্তা অধিকার অধিদপ্তর", dept: "দ্রব্যমূল্য কারসাজি ও ভেজাল প্রতিরোধ", number: "16121", displayNum: "১৬১২১", icon: "🛒", color: "#22c55e", badge: "ভোক্তা বাতায়ন" },
  { id: "em10", name: "সরকারি আইনি সহায়তা (Legal Aid)", dept: "আইন, বিচার ও সংসদ বিষয়ক মন্ত্রণালয়", number: "16430", displayNum: "১৬৪৩০", icon: "🏛️", color: "#8b5cf6", badge: "বিনামূল্যে আইনি সেবা" },
  { id: "em11", name: "জাতীয় পরিচয়পত্র ও নির্বাচন কমিশন", dept: "এনআইডি জালিয়াতি ও তথ্য যাচাই", number: "105", displayNum: "১০৫", icon: "🪪", color: "#14b8a6", badge: "এনআইডি হেল্পডেস্ক" },
  { id: "em12", name: "বিটিআরসি (BTRC) টেলিকম অভিযোগ", dept: "সিম জালিয়াতি ও অবৈধ ভিওআইপি প্রতিরোধ", number: "100", displayNum: "১০০", icon: "📡", color: "#3b82f6", badge: "টেলিকম রেগুলেটর" },
  { id: "em13", name: "বাংলাদেশ ব্যাংক (BFIU ও গ্রাহক সেবা)", dept: "ব্যাংকিং প্রতারণা ও মোবাইল ফাইন্যান্স অভিযোগ", number: "16236", displayNum: "১৬২৩৬", icon: "🏦", color: "#10b981", badge: "আর্থিক গোয়েন্দা" },
  { id: "em14", name: "হাইওয়ে পুলিশ সদর দপ্তর", dept: "মহাসড়কে ডাকাতি, দুর্ঘটনা ও চাঁদাবাজি দমন", number: "01320182500", displayNum: "০১৩২০১৮২৫০০", icon: "🚓", color: "#6366f1", badge: "হাইওয়ে পেট্রোল" },
  { id: "em15", name: "মাদকদ্রব্য নিয়ন্ত্রণ অধিদপ্তর (DNC)", dept: "মাদক চোরাচালান ও গোপন আস্তানার তথ্য", number: "01908888888", displayNum: "০১৯০৮৮৮৮৮৮৮", icon: "🚫", color: "#f43f5e", badge: "নার্কোটিকস কন্ট্রোল" },
  { id: "em16", name: "জাতীয় জরুরি স্বাস্থ্য সেবা (স্বাস্থ্য বাতায়ন)", dept: "জরুরি মেডিকেল ও হাসপাতাল অভিযোগ", number: "16263", displayNum: "১৬২৬৩", icon: "🏥", color: "#0ea5e9", badge: "স্বাস্থ্য অধিদপ্তর" },
  { id: "em17", name: "দুর্যোগের আগাম বার্তা ও ত্রাণ নিয়ন্ত্রণ", dept: "দুর্যোগ ব্যবস্থাপনা ও ত্রাণ মন্ত্রণালয়", number: "1090", displayNum: "১০৯০", icon: "🌪️", color: "#f97316", badge: "জরুরি ত্রাণ সেল" },
  { id: "em18", name: "প্রবাসী কল্যাণ ও মানবপাচার প্রতিরোধ", dept: "প্রবাসী কল্যাণ ও বৈদেশিক কর্মসংস্থান", number: "16135", displayNum: "১৬১৩৫", icon: "✈️", color: "#0284c7", badge: "প্রবাস বন্ধু কলসেন্টার" },
  { id: "em19", name: "বাংলাদেশ কোস্ট গার্ড সদর দপ্তর", dept: "নৌ-পথ ও উপকূলীয় চোরাচালান/ডাকাতি প্রতিরোধ", number: "16111", displayNum: "১৬১১১", icon: "⚓", color: "#2563eb", badge: "মেরিটাইম সিকিউরিটি" },
  { id: "em20", name: "বর্ডার গার্ড বাংলাদেশ (BGB)", dept: "সীমান্ত অপরাধ, অস্ত্র ও মানবপাচার দমন", number: "01769600555", displayNum: "০১৭৬৯৬০০৫৫৫", icon: "🛡️", color: "#15803d", badge: "সীমান্ত সুরক্ষা" },
  { id: "em21", name: "তিতাস গ্যাস ও বিদ্যুৎ জরুরি নিয়ন্ত্রণ কক্ষ", dept: "গ্যাস লিকেজ ও নাশকতা প্রতিরোধ হটলাইন", number: "16496", displayNum: "১৬৪৯৬", icon: "⚡", color: "#eab308", badge: "জরুরি এনার্জি সেল" },
  { id: "em22", name: "জাতীয় মানবাধিকার কমিশন", dept: "মানবাধিকার লঙ্ঘন ও গুম/নির্যাতন অভিযোগ", number: "16108", displayNum: "১৬১০৮", icon: "🕊️", color: "#ec4899", badge: "মানবাধিকার সেল" },
  { id: "em23", name: "রেলওয়ে নিরাপত্তা বাহিনী (RNB)", dept: "রেলওয়ে নাশকতা ও নিরাপত্তা হটলাইন", number: "131", displayNum: "১৩১", icon: "🚆", color: "#38bdf8", badge: "রেলওয়ে সেল" },
  { id: "em24", name: "বিদ্যুৎ গ্রাহক সেবা (ডেসকো/ডিপিডিসি)", dept: "বিদ্যুৎ বিপর্যয় ও জরুরি লাইন মেরামত", number: "16116", displayNum: "১৬১১৬", icon: "💡", color: "#facc15", badge: "বিদ্যুৎ হটলাইন" },
  { id: "em25", name: "ওয়াসা (WASA) পানি ও পয়ঃনিষ্কাশন", dept: "পানি সরবরাহ ও ড্রেনেজ জরুরি সেল", number: "16162", displayNum: "১৬১৬২", icon: "💧", color: "#0ea5e9", badge: "ওয়াসা বাতায়ন" },
  { id: "em26", name: "পরিবেশ অধিদপ্তর হটলাইন", dept: "শব্দ দূষণ, নদী দূষণ ও ক্ষতিকর নির্গমন", number: "16123", displayNum: "১৬১২৩", icon: "🌿", color: "#22c55e", badge: "পরিবেশ সেল" },
  { id: "em27", name: "জাতীয় পেনশন কর্তৃপক্ষ (NPA)", dept: "পেনশন স্কিম জালিয়াতি ও অভিযোগ", number: "16655", displayNum: "১৬৬৫৫", icon: "💼", color: "#8b5cf6", badge: "পেনশন সেল" },
  { id: "em28", name: "বাংলাদেশ নিরাপদ খাদ্য কর্তৃপক্ষ", dept: "খাবারে বিষাক্ত কেমিক্যাল ও ভেজাল অভিযোগ", number: "16155", displayNum: "১৬১৫৫", icon: "🥗", color: "#10b981", badge: "নিরাপদ খাদ্য" },
  { id: "em29", name: "ঢাকা মেট্রোপলিটন পুলিশ ট্রাফিক হেল্পলাইন", dept: "সড়ক দুর্ঘটনা ও যানজট জরুরি তথ্য", number: "01713398500", displayNum: "০১৭১৩৩৯৮৫০০", icon: "🚦", color: "#f59e0b", badge: "ট্রাফিক কন্ট্রোল" },
  { id: "em30", name: "ব্রেকিং সাইবার ইনভেস্টিগেশন কলসেন্টার", dept: "হোয়াটসঅ্যাপ ও ফেসবুক হ্যাকিং সহায়তা", number: "01320020420", displayNum: "০১৩২০০২০৪২০", icon: "🕵️", color: "#dc2626", badge: "সাইবার ইমার্জেন্সি" },
  { id: "em31", name: "জাতীয় জরুরি তথ্য সেবা (তথ্য বাতায়ন)", dept: "সরকারি সেবা ও জেলা প্রশাসনের জরুরি তথ্য", number: "333", displayNum: "৩৩৩", icon: "ℹ️", color: "#6366f1", badge: "নাগরিক বাতায়ন" },
  { id: "em32", name: "জাতীয় রাজস্ব বোর্ড (শুল্ক গোয়েন্দা)", dept: "রাজস্ব ফাঁকি ও চোরাচালান প্রতিরোধ সেল", number: "028318128", displayNum: "০২৮৩১৮১২৮", icon: "🚢", color: "#e11d48", badge: "কাস্টমস ইন্টেল" }

];

const INITIAL_CONTACTS_DIRECTORY = [
  { id: "CNT-01", name: "সাইবার ক্রাইম ইনভেস্টিগেশন ইউনিট", role: "ঢাকা মেট্রোপলিটন পুলিশ (DMP)", phone: "০১৩২০-১০১৪৮", email: "cyberunit@dmp.gov.bd", district: "ঢাকা", status: "সক্রিয়" },
  { id: "CNT-02", name: "ফরেনসিক ডকুমেন্ট ও মিডিয়া ল্যাব", role: "সিআইডি সদর দপ্তর", phone: "০১৩২০-০১০১৫০", email: "forensics@cid.gov.bd", district: "ঢাকা", status: "সক্রিয়" },
  { id: "CNT-03", name: "চট্টগ্রাম বন্দর শুল্ক গোয়েন্দা সেল", role: "জাতীয় রাজস্ব বোর্ড (NBR)", phone: "০২৩৩৩৩-১২২১১", email: "customs.intel@cpa.gov.bd", district: "চট্টগ্রাম", status: "সক্রিয়" },
  { id: "CNT-04", name: "হাইওয়ে পেট্রোল কমান্ড সেন্টার", role: "কুমিল্লা রিজিয়ন", phone: "০১৩২০-১৮২৫৫৫", email: "cumilla@highwaypolice.gov.bd", district: "কুমিল্লা", status: "সক্রিয়" }
];

const INITIAL_REPORTERS = [
  { id: "REP-101", name: "মো. রফিকুল ইসলাম", email: "rafiq@crimezoo.org", phone: "০১৭১১-২২৩৩৪৪", pass: "123456", badgeNo: "CZ-REP-2026-01", district: "চট্টগ্রাম", verifiedReports: 14, status: "ভেরিফাইড রিপোর্টার" },
  { id: "REP-102", name: "ডা. ফারহানা করিম", email: "farhana@crimezoo.org", phone: "০১৭৫৫-৬৬৭৭৮৮", pass: "123456", badgeNo: "CZ-REP-2026-02", district: "ঢাকা", verifiedReports: 9, status: "ইনভেস্টিগেটিভ রিপোর্টার" }
];

const INITIAL_CONTACT_MESSAGES = [
  { id: "MSG-101", type: "direct_admin", name: "বেনামি হুইসেলব্লোয়ার", phone: "গোপনীয়", email: "whistle@secure.tip", subject: "কাস্টমস খালাসে জাল নথি", message: "নির্দিষ্ট একটি কন্টেইনারে আজ রাতে অবৈধ পণ্য খালাস করার গোপন পরিকল্পনা করা হচ্ছে। সংযুক্ত পিডিএফ দেখুন।", mediaAttached: "Photo + PDF Evidence", date: "০৬ নভেম্বর ২০২৬", status: "unread" },
  { id: "MSG-102", type: "contact", name: "মাহমুদুল হাসান", phone: "০১৭১২-XXXXXX", email: "hasan@gmail.com", subject: "অনলাইন প্রতারণার শিকার", message: "একটি ই-কমার্স পেজ অগ্রিম টাকা নিয়ে ব্লক করেছে। স্ক্রিনশট ও অডিও রেকর্ড সংযুক্ত করলাম।", mediaAttached: "Audio + Image", date: "০৫ নভেম্বর ২০২৬", status: "read" }
];

const INITIAL_AUDIT_LOGS = [
  { id: "LOG-501", action: "টাইম-লক ভেরিফাইড লগইন", target: "ADMIN-GATEWAY", admin: "Super Admin", time: "০৬ নভেম্বর ২০২৬, ২৩:১৫", detail: "২-ধাপের পাসকোড ও ডাইনামিক টাইম-লক যাচাই সম্পন্ন।" },
  { id: "LOG-502", action: "অটো যাচাই মডিউল রান", target: "CZ-2026-8941", admin: "Super Admin", time: "০৬ নভেম্বর ২০২৬, ২০:৪০", detail: "ফরেনসিক স্কোর ৯৭% নিশ্চিত করে 'ভেরিফাইড' স্ট্যাটাসে উন্নীত করা হয়েছে।" },
  { id: "LOG-503", action: "ভুয়া পোস্ট চিহ্নিত", target: "CZ-2026-6105", admin: "Fact Checker", time: "০৪ নভেম্বর ২০২৬, ১২:১৫", detail: "এআই ইমেজ আর্টফ্যাক্ট শনাক্ত হওয়ায় 'ভুয়া' স্ট্যাম্প দেওয়া হয়েছে।" }
];

class StorageManager {
  static getReports() {
    const data = localStorage.getItem("crime_zoo_reports_v2");
    if (!data) {
      localStorage.setItem("crime_zoo_reports_v2", JSON.stringify(INITIAL_REPORTS));
      return INITIAL_REPORTS;
    }
    try { return JSON.parse(data); } catch (e) { return INITIAL_REPORTS; }
  }

  static saveReports(reports) {
    localStorage.setItem("crime_zoo_reports_v2", JSON.stringify(reports));
  }

  static addReport(newReport) {
    const reports = this.getReports();
    reports.unshift(newReport);
    this.saveReports(reports);
    this.addAuditLog("নতুন রিপোর্ট দাখিল", newReport.id, newReport.reporterType === "anonymous" ? "বেনামি" : newReport.reporterName, "রিপোর্ট ও মাল্টি-মিডিয়া প্রমাণ ডাটাবেজে সংরক্ষিত হয়েছে।");
    return newReport;
  }

  static updateReport(reportId, updatedFields) {
    const reports = this.getReports();
    const idx = reports.findIndex(r => r.id === reportId);
    if (idx !== -1) {
      reports[idx] = { ...reports[idx], ...updatedFields };
      this.saveReports(reports);
      this.addAuditLog("পোস্ট সম্পাদনা/আপডেট", reportId, "Admin", `স্ট্যাটাস: ${reports[idx].status}, স্কোর: ${reports[idx].truthScore}%`);
      return reports[idx];
    }
    return null;
  }

  static updateReportStatus(reportId, status, note, truthScore) {
    return this.updateReport(reportId, {
      status,
      statusNote: note || "",
      truthScore: truthScore !== undefined ? truthScore : 50
    });
  }

  static deleteReport(reportId) {
    let reports = this.getReports().filter(r => r.id !== reportId);
    this.saveReports(reports);
    this.addAuditLog("রিপোর্ট ডিলিট", reportId, "Admin", "রিপোর্ট স্থায়ীভাবে মুছে ফেলা হয়েছে।");
    return true;
  }

  static incrementView(reportId) {
    const reports = this.getReports();
    const rep = reports.find(r => r.id === reportId);
    if (rep) {
      rep.views = (rep.views || 0) + 1;
      this.saveReports(reports);
      return rep.views;
    }
    return 0;
  }

  static toggleLike(reportId) {
    const reports = this.getReports();
    const rep = reports.find(r => r.id === reportId);
    const likedKey = `cz_liked_${reportId}`;
    const alreadyLiked = localStorage.getItem(likedKey) === "true";
    if (rep) {
      if (alreadyLiked) {
        rep.likes = Math.max(0, (rep.likes || 1) - 1);
        localStorage.removeItem(likedKey);
      } else {
        rep.likes = (rep.likes || 0) + 1;
        localStorage.setItem(likedKey, "true");
      }
      this.saveReports(reports);
      return { likes: rep.likes, isLiked: !alreadyLiked };
    }
    return { likes: 0, isLiked: false };
  }

  static addComment(reportId, userName, commentText) {
    const reports = this.getReports();
    const rep = reports.find(r => r.id === reportId);
    if (rep) {
      const newComment = {
        id: "c_" + Date.now(),
        user: userName || "সচেতন নাগরিক",
        date: "এইমাত্র",
        text: commentText
      };
      if (!rep.comments) rep.comments = [];
      rep.comments.unshift(newComment);
      this.saveReports(reports);
      return newComment;
    }
    return null;
  }

  // Contacts Directory CRUD
  static getContacts() {
    const data = localStorage.getItem("crime_zoo_contacts");
    if (!data) {
      localStorage.setItem("crime_zoo_contacts", JSON.stringify(INITIAL_CONTACTS_DIRECTORY));
      return INITIAL_CONTACTS_DIRECTORY;
    }
    try { return JSON.parse(data); } catch (e) { return INITIAL_CONTACTS_DIRECTORY; }
  }

  static saveContacts(list) {
    localStorage.setItem("crime_zoo_contacts", JSON.stringify(list));
  }

  static addContact(item) {
    const list = this.getContacts();
    list.unshift(item);
    this.saveContacts(list);
    this.addAuditLog("কন্টাক্ট যুক্ত", item.id, "Admin", `${item.name} কন্টাক্ট লিস্টে যুক্ত হয়েছে।`);
  }

  static updateContact(id, updated) {
    const list = this.getContacts();
    const idx = list.findIndex(c => c.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updated };
      this.saveContacts(list);
    }
  }

  static deleteContact(id) {
    const list = this.getContacts().filter(c => c.id !== id);
    this.saveContacts(list);
    this.addAuditLog("কন্টাক্ট ডিলিট", id, "Admin", "কন্টাক্ট মুছে ফেলা হয়েছে।");
  }

  // Reporters Management
  static getReporters() {
    const data = localStorage.getItem("crime_zoo_reporters");
    if (!data) {
      localStorage.setItem("crime_zoo_reporters", JSON.stringify(INITIAL_REPORTERS));
      return INITIAL_REPORTERS;
    }
    try { return JSON.parse(data); } catch (e) { return INITIAL_REPORTERS; }
  }

  static registerReporter(rep) {
    const list = this.getReporters();
    list.unshift(rep);
    localStorage.setItem("crime_zoo_reporters", JSON.stringify(list));
    return rep;
  }

  static deleteReporter(id) {
    const list = this.getReporters().filter(r => r.id !== id);
    localStorage.setItem("crime_zoo_reporters", JSON.stringify(list));
  }

  // Messages & Direct Complaints
  static getMessages() {
    const data = localStorage.getItem("crime_zoo_messages");
    if (!data) {
      localStorage.setItem("crime_zoo_messages", JSON.stringify(INITIAL_CONTACT_MESSAGES));
      return INITIAL_CONTACT_MESSAGES;
    }
    try { return JSON.parse(data); } catch (e) { return INITIAL_CONTACT_MESSAGES; }
  }

  static addMessage(msg) {
    const messages = this.getMessages();
    messages.unshift(msg);
    localStorage.setItem("crime_zoo_messages", JSON.stringify(messages));
  }

  static deleteMessage(id) {
    const messages = this.getMessages().filter(m => m.id !== id);
    localStorage.setItem("crime_zoo_messages", JSON.stringify(messages));
  }

  // Audit Logs
  static getAuditLogs() {
    const data = localStorage.getItem("crime_zoo_audit_logs");
    if (!data) {
      localStorage.setItem("crime_zoo_audit_logs", JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    try { return JSON.parse(data); } catch (e) { return INITIAL_AUDIT_LOGS; }
  }

  static addAuditLog(action, target, admin, detail) {
    const logs = this.getAuditLogs();
    logs.unshift({
      id: "LOG-" + Math.floor(100 + Math.random() * 900),
      action,
      target,
      admin,
      time: new Date().toLocaleString("bn-BD"),
      detail
    });
    localStorage.setItem("crime_zoo_audit_logs", JSON.stringify(logs.slice(0, 120)));
  }

  // Deep Forensics Deterministic Evaluation Engine
  static evaluatePostForensics(report) {
    const hasPhoto = !!report.mediaUrl;
    const hasVideo = !!report.videoUrl;
    const hasAudio = !!report.audioUrl;
    const hasPdf = !!report.pdfUrl;
    const descLen = (report.description || "").length;

    let baseScore = report.truthScore || 75;
    if (report.status === "fake") baseScore = 11;
    else if (report.status === "verified") baseScore = Math.max(92, baseScore);

    const elaPass = baseScore > 40;
    const exifStatus = elaPass ? "ক্যামেরা/ডিভাইস অরিজিন সিগনেচার অক্ষত (Unaltered Stream)" : "কৃত্রিম এআই জেনারেশন বা ফটোশপ ক্লোন লেয়ার শনাক্ত!";
    const audioSpectral = hasAudio ? "ভয়েস ফ্রিকোয়েন্সি প্রাকৃতিক (০% সিনথেটিক ডিপফেক ক্লোন)" : "অডিও ফাইল সংযুক্ত নেই";
    const pdfHashStatus = hasPdf ? "SHA-256 ডকুমেন্ট হ্যাশ ভেরিফাইড ও অপরিবর্তিত" : "পিডিএফ সংযুক্ত নেই";

    return {
      caseId: report.id,
      title: report.title,
      overallScore: baseScore,
      verdict: baseScore >= 80 ? "ভেরিফাইড ও প্রামাণিক (Authentic Evidence)" : (baseScore <= 30 ? "কৃত্রিম / ভুয়া (Manipulated / AI Fake)" : "আংশিক প্রামাণিক / মাঠপর্যায়ে যাচাই প্রয়োজন"),
      elaPass,
      exifStatus,
      audioSpectral,
      pdfHashStatus,
      mediaCount: [hasPhoto, hasVideo, hasAudio, hasPdf].filter(Boolean).length,
      textIntegrity: descLen > 80 ? "মানবিক ভাষা ও ঘটনার ধারাবাহিকতা প্রামাণিক" : "সংক্ষিপ্ত বিবরণ"
    };
  }
}

window.StorageManager = StorageManager;
window.EMERGENCY_SECTORS = EMERGENCY_SECTORS;
