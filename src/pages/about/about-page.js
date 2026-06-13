export default class AboutPage {
  async render() {
    return `
      <section class="container glass-panel" style="margin-top:20px;">
        <h1>About JejakCerita</h1>
        <p style="margin-top:15px; line-height:1.6; color:var(--text-muted);">
          JejakCerita adalah platform Progressive Web App (PWA) modern untuk membagikan 
          pengalaman dan petualangan berharga Anda dalam bentuk cerita interaktif lengkap dengan penanda lokasi pada peta Leaflet.
        </p>
      </section>
    `;
  }

  async afterRender() {
    // Do your job here
  }
}
