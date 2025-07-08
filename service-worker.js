const CACHE_NAME = 'syllogimous-v3-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/codec.css',
  '/css/wcst.css',
  '/css/styles.css',
  '/js/codec.js',
  '/js/constants.js',
  '/js/generators.js',
  '/js/wcst.js',
  '/js/index.js',
  '/favicon.png',
  '/img/metal-gear-fox.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});