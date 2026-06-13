class AddStoryView {
  getTemplate() {
    return `
      <section class="add-container">
        <div class="glass-panel add-card" style="width: 100%; max-width: 600px;">
          <h1>Bagikan Cerita Baru</h1>
          <form id="add-story-form" class="auth-form">
            
            <!-- Media Section -->
            <div class="form-group media-section" style="margin-bottom: 20px;">
               <div id="video-container" style="display:none; text-align: center; margin-bottom: 10px;">
                 <video id="camera-video" autoplay playsinline style="width: 100%; border-radius: 8px; background: #000;"></video>
                 <button type="button" id="capture-btn" class="btn-primary mt-2">Ambil Foto</button>
               </div>
               <img id="photo-preview" class="photo-preview" style="display:none; width: 100%; border-radius: 8px; margin-bottom: 10px; object-fit: cover; max-height: 300px;" alt="Pratinjau Foto" />
               <canvas id="photo-canvas" style="display:none;"></canvas>
               
               <div class="media-controls">
                 <label for="image-upload" class="btn-secondary" tabindex="0" role="button" aria-label="Unggah Gambar dari Perangkat">Unggah Gambar</label>
                 <input type="file" id="image-upload" accept="image/*" style="display:none;">
                 <button type="button" id="start-camera-btn" class="btn-secondary">Gunakan Kamera</button>
               </div>
            </div>

            <!-- Description -->
            <div class="form-group">
              <label for="story-desc">Deskripsi Cerita</label>
              <textarea id="story-desc" name="description" rows="4" required placeholder="Tuliskan momen berharga Anda di sini..."></textarea>
            </div>

            <!-- Location Picker -->
            <div class="form-group">
              <label>Lokasi (Klik pada peta untuk memilih lokasi)</label>
              <div id="add-map" style="height: 250px; border-radius: 8px; margin-top: 8px; z-index: 10;" role="application" aria-label="Peta pemilih lokasi cerita"></div>
              
              <div class="loc-inputs" style="display:flex; gap: 10px; margin-top: 8px;">
                <div style="flex:1;">
                  <label for="lat-input" class="visually-hidden">Latitude</label>
                  <input type="text" id="lat-input" placeholder="Latitude (Garis Lintang)" readonly>
                </div>
                <div style="flex:1;">
                  <label for="lon-input" class="visually-hidden">Longitude</label>
                  <input type="text" id="lon-input" placeholder="Longitude (Garis Bujur)" readonly>
                </div>
              </div>
              <button type="button" id="use-gps-btn" class="btn-secondary mt-2">Gunakan Lokasi GPS Saat Ini</button>
            </div>

            <button type="submit" id="submit-story-btn" class="btn-primary" style="margin-top: 25px;">Unggah Cerita</button>
          </form>
          <div id="add-error" class="error-msg" aria-live="polite"></div>
        </div>
      </section>
    `;
  }

  showError(message) {
    const errorEl = document.getElementById('add-error');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
    }
  }

  hideError() {
    const errorEl = document.getElementById('add-error');
    if (errorEl) {
      errorEl.style.display = 'none';
      errorEl.textContent = '';
    }
  }
}

export default AddStoryView;
