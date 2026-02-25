// SkyNet Can Do Board - Service Worker
// Provides offline capability and caching for PWA

const CACHE_NAME = 'skynet-can-do-board-v2';
const STATIC_CACHE = 'skynet-static-v2';
const CDN_CACHE = 'skynet-cdn-v2';

// Core files to cache for offline use
const CORE_ASSETS = [
  '/skynet-can-do-board/',
  '/skynet-can-do-board/index.html',
  '/skynet-can-do-board/manifest.json',
  '/skynet-can-do-board/icons/icon-192x192.png',
  '/skynet-can-do-board/icons/icon-512x512.png'
];

// CDN resources to cache
const CDN_ASSETS = [
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://cdn.tailwindcss.com'
];

// Install event - cache core assets
self.addEventListener('install', (event) => {
  console.log('[SkyNet SW] Installing service worker...');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[SkyNet SW] Caching core assets');
        return cache.addAll(CORE_ASSETS);
      }),
      caches.open(CDN_CACHE).then((cache) => {
        console.log('[SkyNet SW] Caching CDN assets');
        // CDN assets may fail - don't block install
        return Promise.allSettled(
          CDN_ASSETS.map((url) =>
            cache.add(url).catch((err) => {
              console.warn(`[SkyNet SW] Failed to cache CDN asset: ${url}`, err);
            })
          )
        );
      })
    ]).then(() => {
      console.log('[SkyNet SW] Installation complete');
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SkyNet SW] Activating service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            return (
              name !== STATIC_CACHE &&
              name !== CDN_CACHE &&
              name.startsWith('skynet-')
            );
          })
          .map((name) => {
            console.log(`[SkyNet SW] Deleting old cache: ${name}`);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('[SkyNet SW] Activation complete');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip API calls (Claude API should always go to network)
  if (url.hostname === 'api.anthropic.com') return;

  // For navigation requests (HTML pages), use network-first strategy
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache the latest version
          const responseClone = response.clone();
          caches.open(STATIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Offline - serve from cache
          return caches.match(request).then((cached) => {
            return cached || caches.match('/skynet-can-do-board/index.html');
          });
        })
    );
    return;
  }

  // For CDN resources, use cache-first strategy
  if (
    url.hostname === 'unpkg.com' ||
    url.hostname === 'cdn.tailwindcss.com' ||
    url.hostname === 'cdnjs.cloudflare.com'
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          const responseClone = response.clone();
          caches.open(CDN_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        });
      })
    );
    return;
  }

  // For static assets, use stale-while-revalidate
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(STATIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => cached);

      return cached || fetchPromise;
    })
  );
});

// Handle messages from the app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((names) => {
      names.forEach((name) => {
        if (name.startsWith('skynet-')) {
          caches.delete(name);
        }
      });
    });
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Background sync for future use (e.g., syncing tasks when back online)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-tasks') {
    console.log('[SkyNet SW] Background sync triggered');
    // Future: sync tasks to cloud storage
  }
});

// Push notifications for future use
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'SkyNet has an update for you.',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
      vibrate: [200, 100, 200],
      data: { url: data.url || '/' }
    };
    event.waitUntil(
      self.registration.showNotification(
        data.title || 'SkyNet Can Do Board',
        options
      )
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/skynet-can-do-board/';
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
