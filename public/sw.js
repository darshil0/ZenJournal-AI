const CACHE_NAME = 'zenjournal-v1';
const ASSETS_TO_CACHE = [
  './',
  'index.html',
  'manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&display=swap'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
