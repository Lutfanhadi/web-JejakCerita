import ENDPOINT from './api-endpoint';

class StoryApi {
  static _getAuthToken() {
    return localStorage.getItem('authToken');
  }

  static async getAllStories(location = 1) {
    const response = await fetch(ENDPOINT.GET_ALL_STORIES(location), {
      headers: {
        Authorization: `Bearer ${this._getAuthToken()}`,
      },
    });
    return response.json();
  }

  static async getStoryDetail(id) {
    const response = await fetch(ENDPOINT.GET_STORY(id), {
      headers: {
        Authorization: `Bearer ${this._getAuthToken()}`,
      },
    });
    return response.json();
  }

  static async addStory(data) {
    // data is FormData
    const response = await fetch(ENDPOINT.ADD_STORY, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this._getAuthToken()}`,
      },
      body: data,
    });
    return response.json();
  }

  static async subscribeNotification(subscription) {
    const response = await fetch(ENDPOINT.SUBSCRIBE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this._getAuthToken()}`,
      },
      body: JSON.stringify(subscription),
    });
    return response.json();
  }

  static async unsubscribeNotification() {
    const response = await fetch(ENDPOINT.UNSUBSCRIBE, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this._getAuthToken()}`,
      },
    });
    return response.json();
  }
}

export default StoryApi;
