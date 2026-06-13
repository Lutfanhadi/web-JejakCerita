import HomeView from './home-view';
import HomePresenter from '../../presenters/home-presenter';
import StoryApi from '../../api/story-api';

class HomePage {
  async render() {
    this.view = new HomeView();
    return this.view.getTemplate();
  }

  async afterRender() {
    this.presenter = new HomePresenter({
      view: this.view,
      model: StoryApi
    });
    await this.presenter.init();
  }
}

export default HomePage;
