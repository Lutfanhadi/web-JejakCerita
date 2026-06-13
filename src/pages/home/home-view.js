class HomeView {
  getTemplate() {
    return `
      <section class="home-container">
        <h1 class="visually-hidden">JejakCerita - Beranda</h1>
        
        <div class="stories-panel glass-panel">
          <div class="panel-header">
            <h2>Recent Stories</h2>
            <div style="display: flex; gap: 8px; align-items: center;">
              <button id="install-btn" class="btn-primary" style="display: none; width: auto; padding: 8px 16px; font-size: 0.85rem;" aria-label="Pasang Aplikasi JejakCerita">Pasang Aplikasi</button>
              <a href="#/add" class="btn-primary" style="text-align: center; display: inline-block; width: auto; padding: 8px 16px; font-size: 0.85rem; text-decoration: none;">+ Tambah Cerita</a>
            </div>
          </div>

          <!-- Notification Control Panel -->
          <div class="notification-panel" style="background: rgba(15, 23, 42, 0.4); border: 1px solid var(--glass-border); padding: 12px; margin-bottom: 15px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center; gap: 10px;">
            <div style="flex: 1;">
              <h3 style="font-size: 0.95rem; margin-bottom: 2px;">Notifikasi Cerita Baru</h3>
              <p style="font-size: 0.75rem; color: var(--text-muted); margin: 0;">Dapatkan info cerita baru secara realtime.</p>
            </div>
            <div>
              <button id="notif-toggle-btn" class="btn-secondary" style="width: auto; padding: 6px 12px; font-size: 0.8rem; border-color: var(--primary); color: var(--primary);" aria-live="polite">
                Memeriksa...
              </button>
            </div>
          </div>

          <div id="stories-list" class="stories-list">
            <p>Memuat cerita...</p>
          </div>
        </div>

        <div class="map-panel glass-panel">
          <div id="stories-map" class="map-container" aria-label="Peta Lokasi Cerita" role="application"></div>
        </div>
      </section>
    `;
  }

  renderStories(stories) {
    const listEl = document.getElementById('stories-list');
    listEl.innerHTML = '';
    
    if (stories.length === 0) {
      listEl.innerHTML = '<p>Tidak ada cerita ditemukan.</p>';
      return;
    }

    stories.forEach(story => {
      const date = new Date(story.createdAt).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      const card = document.createElement('div');
      card.classList.add('story-card');
      card.setAttribute('data-id', story.id);
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `Cerita oleh ${story.name}, deskripsi: ${story.description.substring(0, 100)}`);
      
      card.innerHTML = `
        <img src="${story.photoUrl}" alt="Foto cerita oleh ${story.name}" class="story-img" loading="lazy">
        <div class="story-info" style="flex:1;">
          <h3>${story.name}</h3>
          <p class="story-desc">${story.description}</p>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
            <span class="story-date">${date}</span>
            <a href="#/stories/${story.id}" class="story-detail-link" style="color: #818cf8; text-decoration: none; font-size: 0.85rem; font-weight: 600;" aria-label="Lihat detail cerita oleh ${story.name}">Lihat Detail →</a>
          </div>
        </div>
      `;
      listEl.appendChild(card);
    });

    // Make detail links stop event propagation to card (prevents map shifting)
    listEl.querySelectorAll('.story-detail-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    });
  }

  showError(message) {
    const listEl = document.getElementById('stories-list');
    if (listEl) {
      listEl.innerHTML = `<p class="error-msg" style="display:block;">${message}</p>`;
    }
  }
}

export default HomeView;
