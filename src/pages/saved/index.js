import SavedView from './saved-view';
import SavedPresenter from '../../presenters/saved-presenter';

class SavedPage {
  async render() {
    this.view = new SavedView();
    return this.view.getTemplate();
  }

  async afterRender() {
    this.presenter = new SavedPresenter({
      view: this.view
    });
    await this.presenter.init();
  }
}

export default SavedPage;
