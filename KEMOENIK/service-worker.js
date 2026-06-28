const CACHE_NAME = 'kemoenik-v1';
const OFFLINE_FILES = [
  '/KEMOENIK/',
  '/KEMOENIK/index.html',
  '/KEMOENIK/about.html',
  '/KEMOENIK/menu.html',
  '/KEMOENIK/produk.html',
  '/KEMOENIK/book.html',
  '/KEMOENIK/css/bootstrap.css',
  '/KEMOENIK/css/style.css',
  '/KEMOENIK/css/responsive.css',
  '/KEMOENIK/css/font-awesome.min.css',
  '/KEMOENIK/js/jquery-3.4.1.min.js',
  '/KEMOENIK/js/bootstrap.js',
  '/KEMOENIK/js/custom.js',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(OFFLINE_FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.hostname !== location.hostname) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        if (response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    }).catch(() => caches.match('/KEMOENIK/index.html'))
  );
});
