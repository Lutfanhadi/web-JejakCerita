class DetailView {
  getTemplate() {
    return `
      <section class="detail-container">
        <div style="margin-bottom: 20px;">
          <a href="#/" class="btn-secondary" style="display:inline-block; width:auto; text-decoration:none; padding: 8px 16px;">← Kembali ke Beranda</a>
        </div>

        <div id="detail-content" class="glass-panel" style="max-width: 800px; margin: 0 auto; padding: 25px;">
          <p>Memuat rincian cerita...</p>
        </div>
      </section>
    `;
  }

  renderDetail(story, isSaved) {
    const contentEl = document.getElementById('detail-content');
    if (!contentEl) return;

    const date = new Date(story.createdAt).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const saveButtonText = isSaved ? '★ Hapus dari Tersimpan' : '☆ Simpan Cerita';
    const saveButtonClass = isSaved ? 'btn-secondary' : 'btn-primary';
    const saveButtonColorStyle = isSaved ? 'border-color:#ef4444; color:#ef4444;' : '';

    let mapSection = '';
    if (story.lat && story.lon) {
      mapSection = `
        <div class="detail-map-section" style="margin-top: 25px;">
          <h3 style="font-size: 1.1rem; margin-bottom: 10px;">Lokasi Cerita</h3>
          <div id="detail-map" style="height: 300px; border-radius: 8px; z-index: 10;" role="application" aria-label="Peta lokasi cerita"></div>
        </div>
      `;
    }

    contentEl.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:15px; margin-bottom: 20px;">
        <h1 style="font-size: 1.8rem; text-align: left; margin:0;">Cerita dari ${story.name}</h1>
        <button id="save-toggle-btn" class="${saveButtonClass}" style="width:auto; padding: 10px 20px; font-size: 0.9rem; ${saveButtonColorStyle}" aria-label="${isSaved ? 'Hapus cerita ini dari bookmark tersimpan' : 'Simpan cerita ini ke bookmark tersimpan'}">
          ${saveButtonText}
        </button>
      </div>

      <img src="${story.photoUrl}" alt="Foto cerita oleh ${story.name}" style="width: 100%; border-radius: 12px; max-height: 450px; object-fit: cover; margin-bottom: 20px;" loading="lazy">

      <div class="story-meta" style="margin-bottom: 20px; border-bottom: 1px solid var(--glass-border); padding-bottom: 15px;">
        <span class="story-date" style="font-size: 0.9rem; color:#818cf8; display:block;">Diunggah pada: ${date}</span>
      </div>

      <div class="story-body" style="line-height: 1.7; font-size: 1.05rem;">
        <p>${story.description}</p>
      </div>

      ${mapSection}
    `;
  }

  showError(message) {
    const contentEl = document.getElementById('detail-content');
    if (contentEl) {
      contentEl.innerHTML = `
        <p class="error-msg" style="display:block;">${message}</p>
        <div style="text-align:center; margin-top:20px;">
          <a href="#/" class="btn-primary" style="display:inline-block; width:auto; text-decoration:none; padding:10px 20px;">Kembali ke Beranda</a>
        </div>
      `;
    }
  }
}

export default DetailView;
