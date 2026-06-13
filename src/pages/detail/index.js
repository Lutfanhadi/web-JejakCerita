import DetailView from './detail-view';
import DetailPresenter from '../../presenters/detail-presenter';
import StoryApi from '../../api/story-api';

class DetailPage {
  async render() {
    this.view = new DetailView();
    return this.view.getTemplate();
  }

  async afterRender() {
    this.presenter = new DetailPresenter({
      view: this.view,
      model: StoryApi
    });
    await this.presenter.init();
  }
}

export default DetailPage;
