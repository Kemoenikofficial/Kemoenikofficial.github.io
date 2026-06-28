const CACHE_NAME = 'kemoenik-store-v1';
const OFFLINE_FILES = [
  '/kemoenik-store/',
  '/kemoenik-store/index.html',
  '/kemoenik-store/about.html',
  '/kemoenik-store/menu.html',
  '/kemoenik-store/produk.html',
  '/kemoenik-store/book.html',
  '/kemoenik-store/css/bootstrap.css',
  '/kemoenik-store/css/style.css',
  '/kemoenik-store/css/responsive.css',
  '/kemoenik-store/css/font-awesome.min.css',
  '/kemoenik-store/js/jquery-3.4.1.min.js',
  '/kemoenik-store/js/bootstrap.js',
  '/kemoenik-store/js/custom.js',
];

// Install: cache semua file utama
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

// Fetch: cache-first untuk aset lokal
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Skip request ke domain eksternal
  if (url.hostname !== location.hostname) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        if (response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    }).catch(() => {
      return caches.match('/kemoenik-store/index.html');
    })
  );
});
