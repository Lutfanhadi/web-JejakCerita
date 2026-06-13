import AddStoryView from './add-view';
import AddStoryPresenter from '../../presenters/add-presenter';
import StoryApi from '../../api/story-api';

class AddStoryPage {
  async render() {
    this.view = new AddStoryView();
    return this.view.getTemplate();
  }

  async afterRender() {
    this.presenter = new AddStoryPresenter({
      view: this.view,
      model: StoryApi
    });
    this.presenter.init();
  }
}

export default AddStoryPage;
