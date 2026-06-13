importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

if (workbox) {
  console.log('Workbox successfully loaded in Service Worker');

  // Custom cache names
  const CACHE_NAME_STATIC = 'jejakcerita-static-v1';
  const CACHE_NAME_API = 'jejakcerita-api-v1';
  const CACHE_NAME_IMAGES = 'jejakcerita-images-v1';

  // Cache static assets (CSS, JS, index.html, manifest, icons)
  workbox.routing.registerRoute(
    ({ request, url }) =>
      request.destination === 'style' ||
      request.destination === 'script' ||
      request.destination === 'document' ||
      request.destination === 'font' ||
      url.pathname.includes('manifest.webmanifest') ||
      url.pathname.startsWith('/images/'),
    new workbox.strategies.CacheFirst({
      cacheName: CACHE_NAME_STATIC,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        }),
      ],
    })
  );

  // Cache API stories lists and details (Stale While Revalidate)
  workbox.routing.registerRoute(
    ({ url }) =>
      url.origin === 'https://story-api.dicoding.dev' &&
      (url.pathname.startsWith('/v1/stories') || url.pathname.startsWith('/v1/stories/')),
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: CACHE_NAME_API,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        }),
      ],
    })
  );

  // Cache API story image attachments (Cache First)
  workbox.routing.registerRoute(
    ({ url }) =>
      url.origin === 'https://story-api.dicoding.dev' &&
      url.pathname.startsWith('/v1/images/'),
    new workbox.strategies.CacheFirst({
      cacheName: CACHE_NAME_IMAGES,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        }),
      ],
    })
  );
} else {
  console.log('Workbox failed to load in Service Worker');
}

// === PUSH NOTIFICATION EVENTS ===
self.addEventListener('push', (event) => {
  let title = 'Cerita Baru';
  let options = {
    body: 'Ada cerita baru di JejakCerita!',
    icon: '/images/logo-192.png',
    badge: '/images/logo-192.png',
    data: {
      id: '',
    },
  };

  if (event.data) {
    try {
      const payload = event.data.json();
      title = payload.title || title;
      if (payload.options) {
        options = {
          ...options,
          ...payload.options,
          icon: payload.options.icon || '/images/logo-192.png',
          badge: payload.options.badge || '/images/logo-192.png',
          data: {
            ...options.data,
            ...payload.options.data,
          },
        };
      }
    } catch (e) {
      options.body = event.data.text();
    }
  }

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  const notification = event.notification;
  const storyId = notification.data ? notification.data.id : '';

  notification.close();

  // Redirect client to specific story detail page
  const targetHash = storyId ? `#/stories/${storyId}` : '#/';
  const urlToOpen = new URL(targetHash, self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Focus existing window client if matching
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === urlToOpen || ('navigate' in client)) {
          client.focus();
          return client.navigate(urlToOpen);
        }
      }
      // Or open a new tab/window
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// === BACKGROUND SYNC ===
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-offline-stories') {
    event.waitUntil(syncOfflineStories());
  }
});

// Native IndexedDB helper functions for Service Worker context (no dependencies)
function getOfflineStoriesNative() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('story-app-db', 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('offline-stories')) {
        resolve([]);
        return;
      }
      const transaction = db.transaction('offline-stories', 'readonly');
      const store = transaction.objectStore('offline-stories');
      const getAllRequest = store.getAll();
      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };
  });
}

function deleteOfflineStoryNative(id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('story-app-db', 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction('offline-stories', 'readwrite');
      const store = transaction.objectStore('offline-stories');
      const deleteRequest = store.delete(id);
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    };
  });
}

// Upload offline story to Dicoding API
async function syncOfflineStories() {
  const stories = await getOfflineStoriesNative();
  for (const story of stories) {
    try {
      const formData = new FormData();
      formData.append('description', story.description);
      formData.append('photo', story.photo, 'story_photo.jpg');
      if (story.lat && story.lon) {
        formData.append('lat', story.lat);
        formData.append('lon', story.lon);
      }

      const response = await fetch('https://story-api.dicoding.dev/v1/stories', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${story.token}`,
        },
        body: formData,
      });

      const responseData = await response.json();
      if (!responseData.error) {
        await deleteOfflineStoryNative(story.id);
        
        // Show success local notification
        self.registration.showNotification('Sinkronisasi Berhasil', {
          body: 'Story offline Anda telah diunggah ke server!',
          icon: '/images/logo-192.png',
          badge: '/images/logo-192.png',
        });
      }
    } catch (error) {
      console.error('Failed to sync offline story:', error);
      // Let it try again in the next sync trigger
    }
  }
}
