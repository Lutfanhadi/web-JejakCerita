import LoginView from './login-view';
import LoginPresenter from '../../presenters/login-presenter';
import AuthApi from '../../api/auth-api';

class LoginPage {
  async render() {
    this.view = new LoginView();
    return this.view.getTemplate();
  }

  async afterRender() {
    this.presenter = new LoginPresenter({
      view: this.view,
      model: AuthApi,
    });
    this.presenter.init();
  }
}

export default LoginPage;
