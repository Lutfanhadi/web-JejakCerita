import { parseActivePathname } from '../routes/url-parser';
import DbHelper from '../db/db-helper';
import SyncHelper from '../services/sync-helper';

class DetailPresenter {
  constructor({ view, model }) {
    this._view = view;
    this._model = model;
    this._map = null;
    this._story = null;
  }

  async init() {
    const { id } = parseActivePathname();
    if (!id) {
      this._view.showError('ID Cerita tidak ditemukan.');
      return;
    }

    await this._loadStoryData(id);
  }

  async _loadStoryData(id) {
    try {
      // 1. Check if the story is bookmarked in IndexedDB saved-stories
      let story = await DbHelper.getSavedStory(id);
      let isSaved = !!story;

      if (!story) {
        // 2. Fetch from the server API (which is cached by Workbox)
        const response = await this._model.getStoryDetail(id);
        if (!response.error) {
          story = response.story;
        } else {
          this._view.showError(response.message || 'Gagal memuat detail cerita.');
          return;
        }
      }

      this._story = story;

      // Render the details
      this._view.renderDetail(story, isSaved);

      // Plot leaflet map if coordinates exist
      if (story.lat && story.lon) {
        this._initMap(story.lat, story.lon, story.name);
      }

      // Bind toggle bookmark click
      this._bindSaveToggle(isSaved);

    } catch (error) {
      console.error('Error loading story detail:', error);
      this._view.showError('Terjadi kesalahan saat memuat data cerita. Pastikan Anda online atau data telah dicache.');
    }
  }

  _initMap(lat, lon, name) {
    const mapEl = document.getElementById('detail-map');
    if (!mapEl) return;

    this._map = L.map('detail-map').setView([lat, lon], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this._map);

    const marker = L.marker([lat, lon]).addTo(this._map);
    marker.bindPopup(`<b>${name}</b> berada di lokasi ini.`).openPopup();
  }

  _bindSaveToggle(initialSavedState) {
    const toggleBtn = document.getElementById('save-toggle-btn');
    if (!toggleBtn) return;

    let isSaved = initialSavedState;

    toggleBtn.addEventListener('click', async () => {
      toggleBtn.disabled = true;
      try {
        if (isSaved) {
          await DbHelper.deleteSavedStory(this._story.id);
          SyncHelper.showToast('Cerita dihapus dari daftar tersimpan.');
          isSaved = false;
        } else {
          await DbHelper.saveStory(this._story);
          SyncHelper.showToast('Cerita berhasil disimpan ke daftar tersimpan.');
          isSaved = true;
        }

        // Re-render button state
        this._updateSaveButtonUI(toggleBtn, isSaved);
      } catch (err) {
        console.error('Failed to toggle saved story:', err);
        SyncHelper.showToast('Gagal memproses penyimpanan cerita.');
      } finally {
        toggleBtn.disabled = false;
      }
    });
  }

  _updateSaveButtonUI(btn, isSaved) {
    btn.textContent = isSaved ? '★ Hapus dari Tersimpan' : '☆ Simpan Cerita';
    
    if (isSaved) {
      btn.className = 'btn-secondary';
      btn.style.borderColor = '#ef4444';
      btn.style.color = '#ef4444';
      btn.setAttribute('aria-label', 'Hapus cerita ini dari bookmark tersimpan');
    } else {
      btn.className = 'btn-primary';
      btn.style.borderColor = '';
      btn.style.color = '';
      btn.setAttribute('aria-label', 'Simpan cerita ini ke bookmark tersimpan');
    }
  }
}

export default DetailPresenter;
