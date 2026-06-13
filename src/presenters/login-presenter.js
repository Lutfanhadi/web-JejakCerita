class LoginPresenter {
  constructor({ view, model }) {
    this._view = view;
    this._model = model;
  }

  init() {
    this._listenToFormSubmit();
  }

  _listenToFormSubmit() {
    const form = document.getElementById('login-form');
    if (form) {
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        this._view.hideError();

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const submitBtn = document.getElementById('login-submit');

        submitBtn.disabled = true;
        submitBtn.textContent = 'Logging in...';

        try {
          const response = await this._model.login(email, password);
          if (response.error) {
            this._view.showError(response.message);
          } else {
            localStorage.setItem('authToken', response.loginResult.token);
            localStorage.setItem('authName', response.loginResult.name);
            window.location.hash = '#/';
          }
        } catch (error) {
          this._view.showError('Gagal login. Silakan coba lagi.');
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Login';
        }
      });
    }
  }
}

export default LoginPresenter;
