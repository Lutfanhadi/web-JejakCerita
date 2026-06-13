import DbHelper from '../db/db-helper';
import SyncHelper from '../services/sync-helper';

class AddStoryPresenter {
  constructor({ view, model }) {
    this._view = view;
    this._model = model;
    this._stream = null;
    this._selectedFile = null;
    this._map = null;
    this._marker = null;
  }

  init() {
    this._initMap();
    this._bindEvents();
  }

  _initMap() {
    const mapEl = document.getElementById('add-map');
    if (!mapEl) return;

    this._map = L.map('add-map').setView([-2.5489, 118.0149], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this._map);

    this._map.on('click', (e) => {
      this._updateLocation(e.latlng.lat, e.latlng.lng);
    });
  }

  _updateLocation(lat, lng) {
    const roundedLat = parseFloat(lat.toFixed(6));
    const roundedLng = parseFloat(lng.toFixed(6));

    document.getElementById('lat-input').value = roundedLat;
    document.getElementById('lon-input').value = roundedLng;
    
    if (this._marker) {
      this._marker.setLatLng([lat, lng]);
    } else {
      this._marker = L.marker([lat, lng]).addTo(this._map);
    }
  }

  _bindEvents() {
    const fileInput = document.getElementById('image-upload');
    const startCameraBtn = document.getElementById('start-camera-btn');
    const captureBtn = document.getElementById('capture-btn');
    const gpsBtn = document.getElementById('use-gps-btn');
    const form = document.getElementById('add-story-form');

    fileInput.addEventListener('change', (e) => {
      this._stopCamera();
      const file = e.target.files[0];
      if (file) {
        this._selectedFile = file;
        this._showPreview(URL.createObjectURL(file));
      }
    });

    startCameraBtn.addEventListener('click', () => this._startCamera());
    captureBtn.addEventListener('click', () => this._capturePhoto());
    
    gpsBtn.addEventListener('click', () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            this._updateLocation(pos.coords.latitude, pos.coords.longitude);
            if (this._map) {
              this._map.setView([pos.coords.latitude, pos.coords.longitude], 13);
            }
          },
          (err) => this._view.showError("Gagal mendapatkan lokasi GPS.")
        );
      } else {
        this._view.showError("GPS tidak didukung oleh browser ini.");
      }
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this._submitStory();
    });

    // Cleanup camera when routing away
    this._routeCleanup = () => this._stopCamera();
    window.addEventListener('hashchange', this._routeCleanup, { once: true });
  }

  async _startCamera() {
    this._view.hideError();
    try {
      this._stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      const video = document.getElementById('camera-video');
      if (video) {
        video.srcObject = this._stream;
      }
      
      document.getElementById('video-container').style.display = 'block';
      document.getElementById('photo-preview').style.display = 'none';
      this._selectedFile = null;
    } catch (err) {
      this._view.showError("Akses kamera ditolak atau tidak didukung.");
    }
  }

  _capturePhoto() {
    const video = document.getElementById('camera-video');
    const canvas = document.getElementById('photo-canvas');
    if (!video || !canvas) return;

    const context = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    this._stopCamera();
    
    const dataUrl = canvas.toDataURL('image/jpeg');
    this._showPreview(dataUrl);

    // Convert data URL to File object
    fetch(dataUrl)
      .then(res => res.blob())
      .then(blob => {
        this._selectedFile = new File([blob], "camera_capture.jpg", { type: "image/jpeg" });
      });
  }

  _stopCamera() {
    if (this._stream) {
      this._stream.getTracks().forEach(track => track.stop());
      this._stream = null;
    }
    const container = document.getElementById('video-container');
    if (container) {
      container.style.display = 'none';
    }
  }

  _showPreview(src) {
    const preview = document.getElementById('photo-preview');
    if (preview) {
      preview.src = src;
      preview.style.display = 'block';
    }
  }

  async _submitStory() {
    this._view.hideError();
    if (!this._selectedFile) {
      this._view.showError("Silakan sertakan gambar terlebih dahulu.");
      return;
    }

    const desc = document.getElementById('story-desc').value;
    const latStr = document.getElementById('lat-input').value;
    const lonStr = document.getElementById('lon-input').value;
    const submitBtn = document.getElementById('submit-story-btn');

    const lat = latStr ? parseFloat(latStr) : null;
    const lon = lonStr ? parseFloat(lonStr) : null;

    submitBtn.disabled = true;
    
    // === OFFLINE HANDLER ===
    if (!navigator.onLine) {
      try {
        submitBtn.textContent = "Menyimpan Offline...";
        
        const offlineStory = {
          description: desc,
          photo: this._selectedFile,
          lat: lat,
          lon: lon,
          createdAt: new Date().toISOString(),
          token: localStorage.getItem('authToken')
        };

        await DbHelper.saveOfflineStory(offlineStory);
        
        // Trigger sync service registration
        await SyncHelper.registerSync();

        SyncHelper.showToast('Koneksi terputus. Cerita disimpan secara offline dan akan diunggah otomatis saat terhubung kembali.');
        
        // Redirect to feed
        window.location.hash = '#/';
      } catch (err) {
        console.error('Failed to save story offline:', err);
        this._view.showError("Gagal menyimpan cerita secara offline.");
        submitBtn.disabled = false;
      }
      return;
    }

    // === ONLINE HANDLER ===
    submitBtn.textContent = "Mengunggah...";

    const formData = new FormData();
    formData.append('description', desc);
    formData.append('photo', this._selectedFile);
    if (lat && lon) {
      formData.append('lat', lat);
      formData.append('lon', lon);
    }

    try {
      const response = await this._model.addStory(formData);
      if (response.error) {
        this._view.showError(response.message);
      } else {
        SyncHelper.showToast('Cerita berhasil diunggah!');
        window.location.hash = '#/';
      }
    } catch (err) {
      this._view.showError("Gagal mengunggah cerita ke server.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Unggah Cerita";
    }
  }

  destroy() {
    this._stopCamera();
    if (this._routeCleanup) {
      window.removeEventListener('hashchange', this._routeCleanup);
    }
  }
}

export default AddStoryPresenter;
