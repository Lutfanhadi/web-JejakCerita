class RegisterView {
  getTemplate() {
    return `
      <section class="auth-container">
        <div class="auth-card glass-panel">
          <h1>Daftar Akun JejakCerita</h1>
          <form id="register-form" class="auth-form">
            <div class="form-group">
              <label for="register-name">Nama Lengkap</label>
              <input type="text" id="register-name" name="name" required autocomplete="name">
            </div>
            <div class="form-group">
              <label for="register-email">Email</label>
              <input type="email" id="register-email" name="email" required autocomplete="email">
            </div>
            <div class="form-group">
              <label for="register-password">Password</label>
              <input type="password" id="register-password" name="password" required autocomplete="new-password" minlength="6">
            </div>
            <button type="submit" id="register-submit" class="btn-primary">Daftar</button>
            <p class="auth-link">Sudah punya akun? <a href="#/login">Login di sini</a></p>
          </form>
          <div id="register-error" class="error-msg" aria-live="polite"></div>
          <div id="register-success" class="success-msg" aria-live="polite"></div>
        </div>
      </section>
    `;
  }

  showError(message) {
    const errorEl = document.getElementById('register-error');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
    }
  }

  hideError() {
    const errorEl = document.getElementById('register-error');
    if (errorEl) {
      errorEl.style.display = 'none';
      errorEl.textContent = '';
    }
  }

  showSuccess(message) {
    const successEl = document.getElementById('register-success');
    if (successEl) {
      successEl.textContent = message;
      successEl.style.display = 'block';
    }
  }

  hideSuccess() {
    const successEl = document.getElementById('register-success');
    if (successEl) {
      successEl.style.display = 'none';
      successEl.textContent = '';
    }
  }
}

export default RegisterView;
