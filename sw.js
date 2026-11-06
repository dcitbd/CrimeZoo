const CACHE_NAME = "crime-zoo-v3";
const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./all-reports.html",
  "./fact-check.html",
  "./submit-report.html",
  "./track-report.html",
  "./emergency-helpline.html",
  "./contact.html",
  "./direct-admin-complaint.html",
  "./reporter-login.html",
  "./reporter-register.html",
  "./reporter-dashboard.html",
  "./privacy-policy.html",
  "./terms.html",
  "./offline.html",
  "./assets/css/style.css",
  "./assets/css/security.css",
  "./assets/css/admin.css",
  "./assets/js/data.js",
  "./assets/js/security.js",
  "./assets/js/app.js",
  "./assets/js/submit.js",
  "./assets/js/tracker.js",
  "./assets/js/reporter.js",
  "./assets/js/admin.js",
  "./assets/js/pwa.js",
  "./assets/icons/logo.png",
  "./assets/icons/banner.jpg",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request).catch(() => caches.match("./offline.html"));
    })
  );
});
