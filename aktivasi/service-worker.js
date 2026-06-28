const CACHE_NAME = 'Aktivasi Panduan-v1';
const OFFLINE_FILES = [
  '/aktivasi/',
  '/aktivasi/index.html',
];

// Install: cache file utama
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(OFFLINE_FILES);
    })
  );
  self.skipWaiting();
});

// Activate: hapus cache lama
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch: cache-first untuk file lokal, network-first untuk API
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Jangan cache request ke Firebase/API eksternal
  if (url.hostname.includes('firebase') || 
      url.hostname.includes('googleapis') ||
      url.hostname.includes('googletagmanager')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        // Cache response baru kalau berhasil
        if (response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    }).catch(() => {
      // Fallback ke index.html kalau offline
      return caches.match('/aktivasi/index.html');
    })
  );
});
