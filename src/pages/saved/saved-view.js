class SavedView {
  getTemplate() {
    return `
      <section class="saved-container" style="max-width: 900px; margin: 0 auto; padding: 20px 15px;">
        <div style="margin-bottom: 20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:15px;">
          <a href="#/" class="btn-secondary" style="display:inline-block; width:auto; text-decoration:none; padding: 8px 16px;">← Kembali ke Beranda</a>
          <h1 style="font-size: 1.8rem; margin:0;">Cerita Tersimpan</h1>
        </div>

        <div class="search-filter-panel glass-panel" style="padding: 20px; margin-bottom: 25px; border-radius: 12px;">
          <div style="display:flex; gap:15px; flex-wrap:wrap;">
            <div style="flex: 2; min-width: 250px;">
              <label for="saved-search-input" style="display:block; font-size:0.85rem; color:var(--text-muted); margin-bottom:6px;">Cari Cerita</label>
              <input type="text" id="saved-search-input" placeholder="Cari berdasarkan nama penulis atau deskripsi..." style="width:100%; box-sizing:border-box;">
            </div>
            <div style="flex: 1; min-width: 150px;">
              <label for="saved-sort-select" style="display:block; font-size:0.85rem; color:var(--text-muted); margin-bottom:6px;">Urutkan</label>
              <select id="saved-sort-select" style="width:100%; padding:12px; border-radius:8px; border:1px solid var(--glass-border); background:rgba(15,23,42,0.8); color:#fff; font-size:1rem; font-family:inherit; outline:none; height:47px; box-sizing:border-box;">
                <option value="newest">Terbaru (Newest)</option>
                <option value="oldest">Terlama (Oldest)</option>
              </select>
            </div>
          </div>
        </div>

        <div id="saved-stories-list" class="stories-list" style="max-height: none; overflow-y: visible;">
          <p>Memuat cerita tersimpan...</p>
        </div>
      </section>
    `;
  }

  renderSavedStories(stories) {
    const listEl = document.getElementById('saved-stories-list');
    if (!listEl) return;

    listEl.innerHTML = '';

    if (stories.length === 0) {
      listEl.innerHTML = `
        <div class="glass-panel" style="padding: 40px; text-align: center; border-radius: 12px;">
          <p style="color:var(--text-muted); margin-bottom: 15px;">Tidak ada cerita tersimpan yang cocok.</p>
          <a href="#/" class="btn-primary" style="display:inline-block; width:auto; text-decoration:none; padding:10px 20px;">Jelajahi Cerita Baru</a>
        </div>
      `;
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
      card.setAttribute('aria-label', `Cerita Tersimpan oleh ${story.name}, deskripsi: ${story.description.substring(0, 100)}`);

      card.innerHTML = `
        <img src="${story.photoUrl}" alt="Foto cerita tersimpan oleh ${story.name}" class="story-img" loading="lazy">
        <div class="story-info" style="flex:1;">
          <h3>${story.name}</h3>
          <p class="story-desc">${story.description}</p>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
            <span class="story-date">${date}</span>
            <a href="#/stories/${story.id}" class="story-detail-link" style="color: #818cf8; text-decoration: none; font-size: 0.85rem; font-weight: 600;" aria-label="Lihat rincian detail cerita tersimpan oleh ${story.name}">Lihat Detail →</a>
          </div>
        </div>
      `;
      listEl.appendChild(card);
    });

    // Make detail links stop event propagation to card click
    listEl.querySelectorAll('.story-detail-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    });
  }
}

export default SavedView;
