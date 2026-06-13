// CSS imports
import './styles/styles.css';

import App from './pages/app';
import SyncHelper from './services/sync-helper';

// Helper to show/hide global offline banner
function updateConnectionStatus() {
  const offlineBanner = document.getElementById('offline-banner');
  if (offlineBanner) {
    if (navigator.onLine) {
      offlineBanner.style.display = 'none';
      // Trigger synchronization when connection returns
      SyncHelper.registerSync();
    } else {
      offlineBanner.style.display = 'block';
    }
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });

  // Initial render
  await app.renderPage();

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });

  // Logout handler
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authName');
      window.location.hash = '#/login';
    });
  }

  // === REGISTER SERVICE WORKER ===
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered successfully, scope:', registration.scope);
      
      // Initial connection check
      updateConnectionStatus();
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  // === LISTEN TO CONNECTION STATUS ===
  window.addEventListener('online', updateConnectionStatus);
  window.addEventListener('offline', updateConnectionStatus);

  // Check sync on load if online
  if (navigator.onLine) {
    SyncHelper.registerSync();
  }
});
