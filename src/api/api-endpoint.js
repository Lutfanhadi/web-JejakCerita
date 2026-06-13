import CONFIG from '../data/config';

const ENDPOINT = {
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  GET_ALL_STORIES: (location = 1) => `${CONFIG.BASE_URL}/stories?location=${location}`,
  GET_STORY: (id) => `${CONFIG.BASE_URL}/stories/${id}`,
  ADD_STORY: `${CONFIG.BASE_URL}/stories`,
  SUBSCRIBE: `${CONFIG.BASE_URL}/notifications/subscribe`,
  UNSUBSCRIBE: `${CONFIG.BASE_URL}/notifications/subscribe`,
};

export default ENDPOINT;
