/**
 * @file service-worker.js
 * @description This script handles caching for the PWA, allowing for offline functionality.
 */

// A unique name for the cache to avoid conflicts.
const CACHE_NAME = 'syllogimous-v3-cache-v2'; // Updated cache name for the new version

// A list of all the files and assets that need to be cached for the app to work offline.
// This list has been updated to match the files in the new index.html.
const urlsToCache = [
  '/',
  'index.html',
  'css/codec.css',
  'css/styles.css', // wcst.css is not used in this version
  'js/codec.js',
  'js/constants.js',
  'js/generators.js',
  'js/index.js',
  'favicon.png',
  'img/metal-gear-fox.png',
  'icons/icon-192x192.png',
  'icons/icon-512x512.png'
];

// 'install' event: This is fired when the service worker is first installed.
self.addEventListener('install', event => {
  // We use event.waitUntil to ensure the service worker doesn't install until the cache is populated.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // The addAll() method fetches all the URLs in the list and stores their responses in the cache.
        return cache.addAll(urlsToCache);
      })
  );
});

// 'activate' event: This is fired when the service worker is activated.
// It's a good place to clean up old caches from previous versions.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          // If a cache's name is different from our current cache name, we delete it.
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// 'fetch' event: This is fired for every single request the page makes.
self.addEventListener('fetch', event => {
  // We use event.respondWith() to take control of the response.
  event.respondWith(
    // We check if the requested resource is already in the cache.
    caches.match(event.request)
      .then(response => {
        // If we have a cached version, we return it.
        if (response) {
          return response;
        }
        // If the resource is not in the cache, we fetch it from the network.
        return fetch(event.request);
      }
    )
  );
});
