class RegisterPresenter {
  constructor({ view, model }) {
    this._view = view;
    this._model = model;
  }

  init() {
    this._listenToFormSubmit();
  }

  _listenToFormSubmit() {
    const form = document.getElementById('register-form');
    if (form) {
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        this._view.hideError();
        this._view.hideSuccess();

        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const submitBtn = document.getElementById('register-submit');

        submitBtn.disabled = true;
        submitBtn.textContent = 'Mendaftar...';

        try {
          const response = await this._model.register(name, email, password);
          if (response.error) {
            this._view.showError(response.message);
          } else {
            this._view.showSuccess('Registrasi berhasil! Mengalihkan ke halaman login...');
            setTimeout(() => {
              window.location.hash = '#/login';
            }, 2000);
          }
        } catch (error) {
          this._view.showError('Pendaftaran gagal. Silakan coba lagi.');
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Daftar';
        }
      });
    }
  }
}

export default RegisterPresenter;
