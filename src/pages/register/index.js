import RegisterView from './register-view';
import RegisterPresenter from '../../presenters/register-presenter';
import AuthApi from '../../api/auth-api';

class RegisterPage {
  async render() {
    this.view = new RegisterView();
    return this.view.getTemplate();
  }

  async afterRender() {
    this.presenter = new RegisterPresenter({
      view: this.view,
      model: AuthApi,
    });
    this.presenter.init();
  }
}

export default RegisterPage;
