import PushHelper from '../services/push-helper';
import SyncHelper from '../services/sync-helper';

// Global variable to store beforeinstallprompt event
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Dispatch custom event to notify presenter if it's active
  window.dispatchEvent(new CustomEvent('pwa-installable'));
});

class HomePresenter {
  constructor({ view, model }) {
    this._view = view;
    this._model = model;
    this._map = null;
    this._markers = {};
  }

  async init() {
    const token = localStorage.getItem('authToken');
    if (!token) {
      window.location.hash = '#/login';
      return;
    }

    this._initMap();
    await this._fetchAndRenderStories();
    this._bindListMapSync();
    this._setupInstallPrompt();
    this._setupNotificationToggle();

    // Listen for custom sync completion event to refresh stories
    this._onStoriesSynced = async () => {
      await this._fetchAndRenderStories();
    };
    window.addEventListener('stories-synced', this._onStoriesSynced);
  }

  _initMap() {
    const mapEl = document.getElementById('stories-map');
    if (!mapEl) return;

    // Default center (Indonesia)
    this._map = L.map('stories-map').setView([-2.5489, 118.0149], 5);

    const defaultLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    });

    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EAP, and the GIS User Community'
    });

    defaultLayer.addTo(this._map);

    const baseMaps = {
      "Peta Default": defaultLayer,
      "Satelit": satelliteLayer
    };

    L.control.layers(baseMaps).addTo(this._map);
  }

  async _fetchAndRenderStories() {
    try {
      const response = await this._model.getAllStories(1);
      if (!response.error) {
        this._view.renderStories(response.listStory);
        this._plotMarkers(response.listStory);
      } else {
        this._view.showError('Gagal memuat cerita: ' + response.message);
      }
    } catch (e) {
      // If offline and cache is not available
      this._view.showError('Gagal memuat cerita. Hubungkan ke internet untuk menyegarkan data.');
    }
  }

  _plotMarkers(stories) {
    if (!this._map) return;

    // Clear existing markers
    Object.values(this._markers).forEach(marker => this._map.removeLayer(marker));
    this._markers = {};

    this._defaultIcon = new L.Icon.Default();
    this._activeIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    stories.forEach(story => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(this._map);
        marker.bindPopup(`
          <div style="font-family:inherit; max-width: 200px;">
            <strong style="font-size: 1rem;">${story.name}</strong>
            <p style="font-size: 0.8rem; margin: 4px 0 8px 0; color: #475569;">${story.description.substring(0, 60)}...</p>
            <a href="#/stories/${story.id}" style="color: var(--primary); text-decoration: none; font-weight: 600; font-size: 0.8rem;">Detail Cerita →</a>
          </div>
        `);

        this._markers[story.id] = marker;

        marker.on('click', () => {
          this._highlightMarker(story.id);
          this._scrollToListItem(story.id);
        });
      }
    });

    const markerList = Object.values(this._markers);
    if (markerList.length > 0) {
      const markerGroup = L.featureGroup(markerList);
      this._map.fitBounds(markerGroup.getBounds().pad(0.15));
    }
  }

  _bindListMapSync() {
    const listEl = document.getElementById('stories-list');
    if (!listEl) return;

    listEl.addEventListener('click', (e) => {
      const card = e.target.closest('.story-card');
      if (card) {
        const id = card.getAttribute('data-id');
        this._highlightMarker(id);
        this._highlightListItem(id);

        if (this._markers[id]) {
          this._map.flyTo(this._markers[id].getLatLng(), 12);
          this._markers[id].openPopup();
        }
      }
    });

    // Support keyboard activation (Enter key)
    listEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const card = e.target.closest('.story-card');
        if (card) {
          card.click();
        }
      }
    });
  }

  _highlightMarker(storyId) {
    Object.values(this._markers).forEach(marker => {
      marker.setIcon(this._defaultIcon);
    });

    if (this._markers[storyId]) {
      this._markers[storyId].setIcon(this._activeIcon);
    }
  }

  _highlightListItem(storyId) {
    const cards = document.querySelectorAll('.story-card');
    cards.forEach(card => card.classList.remove('active'));

    const activeCard = document.querySelector(`.story-card[data-id="${storyId}"]`);
    if (activeCard) {
      activeCard.classList.add('active');
    }
  }

  _scrollToListItem(storyId) {
    this._highlightListItem(storyId);
    const activeCard = document.querySelector(`.story-card[data-id="${storyId}"]`);
    if (activeCard) {
      activeCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  // === PWA INSTALLATION ===
  _setupInstallPrompt() {
    const installBtn = document.getElementById('install-btn');
    if (!installBtn) return;

    const showButton = () => {
      if (deferredPrompt) {
        installBtn.style.display = 'inline-block';
      }
    };

    // If prompt is already deferred
    showButton();

    // Event listener if it becomes available later
    this._onInstallable = () => showButton();
    window.addEventListener('pwa-installable', this._onInstallable);

    installBtn.addEventListener('click', async () => {
      if (!deferredPrompt) return;

      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`PWA install prompt choice: ${outcome}`);
      
      deferredPrompt = null;
      installBtn.style.display = 'none';
    });
  }

  // === PUSH NOTIFICATION SUBSCRIPTION ===
  async _setupNotificationToggle() {
    const toggleBtn = document.getElementById('notif-toggle-btn');
    if (!toggleBtn) return;

    const updateButtonUI = (enabled) => {
      if (enabled) {
        toggleBtn.textContent = 'Nonaktifkan';
        toggleBtn.className = 'btn-secondary';
        toggleBtn.style.borderColor = '#ef4444';
        toggleBtn.style.color = '#ef4444';
      } else {
        toggleBtn.textContent = 'Aktifkan';
        toggleBtn.className = 'btn-primary';
        toggleBtn.style.borderColor = '';
        toggleBtn.style.color = '';
      }
      toggleBtn.disabled = false;
    };

    try {
      const isSubscribed = await PushHelper.isEnabled();
      updateButtonUI(isSubscribed);
    } catch (err) {
      toggleBtn.textContent = 'Tidak Didukung';
      toggleBtn.disabled = true;
    }

    toggleBtn.addEventListener('click', async () => {
      toggleBtn.disabled = true;
      toggleBtn.textContent = 'Memproses...';

      try {
        const isSubscribed = await PushHelper.isEnabled();
        if (isSubscribed) {
          await PushHelper.disableNotification();
          updateButtonUI(false);
          SyncHelper.showToast('Notifikasi berhasil dinonaktifkan.');
        } else {
          await PushHelper.enableNotification();
          updateButtonUI(true);
          SyncHelper.showToast('Notifikasi berhasil diaktifkan!');
        }
      } catch (err) {
        console.error('Push notification toggle error:', err);
        SyncHelper.showToast(`Error: ${err.message}`);
        const isSubscribed = await PushHelper.isEnabled();
        updateButtonUI(isSubscribed);
      }
    });
  }

  destroy() {
    if (this._onInstallable) {
      window.removeEventListener('pwa-installable', this._onInstallable);
    }
    if (this._onStoriesSynced) {
      window.removeEventListener('stories-synced', this._onStoriesSynced);
    }
  }
}

export default HomePresenter;
