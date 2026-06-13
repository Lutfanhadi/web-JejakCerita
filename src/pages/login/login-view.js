class LoginView {
  getTemplate() {
    return `
      <section class="auth-container">
        <div class="auth-card glass-panel">
          <h1>Login ke JejakCerita</h1>
          <form id="login-form" class="auth-form">
            <div class="form-group">
              <label for="login-email">Email</label>
              <input type="email" id="login-email" name="email" required autocomplete="email">
            </div>
            <div class="form-group">
              <label for="login-password">Password</label>
              <input type="password" id="login-password" name="password" required autocomplete="current-password">
            </div>
            <button type="submit" id="login-submit" class="btn-primary">Login</button>
            <p class="auth-link">Belum punya akun? <a href="#/register">Daftar di sini</a></p>
          </form>
          <div id="login-error" class="error-msg" aria-live="polite"></div>
        </div>
      </section>
    `;
  }

  showError(message) {
    const errorEl = document.getElementById('login-error');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
    }
  }

  hideError() {
    const errorEl = document.getElementById('login-error');
    if (errorEl) {
      errorEl.style.display = 'none';
      errorEl.textContent = '';
    }
  }
}

export default LoginView;
