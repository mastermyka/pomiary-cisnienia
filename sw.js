const CACHE = 'bp-pwa-v1';
const FILES = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => {
      if(k !== CACHE) return caches.delete(k);
    })))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // cache-first for app shell
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request).catch(()=>caches.match('./')))
  );
});
