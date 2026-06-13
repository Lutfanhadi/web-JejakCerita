import { openDB } from 'idb';

const DATABASE_NAME = 'story-app-db';
const DATABASE_VERSION = 1;
const STORE_SAVED = 'saved-stories';
const STORE_OFFLINE = 'offline-stories';

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_SAVED)) {
      db.createObjectStore(STORE_SAVED, { keyPath: 'id' });
    }
    if (!db.objectStoreNames.contains(STORE_OFFLINE)) {
      db.createObjectStore(STORE_OFFLINE, { keyPath: 'id', autoIncrement: true });
    }
  },
});

const DbHelper = {
  // === SAVED STORIES CRUD ===
  async saveStory(story) {
    const db = await dbPromise;
    return db.put(STORE_SAVED, story);
  },

  async getSavedStories() {
    const db = await dbPromise;
    return db.getAll(STORE_SAVED);
  },

  async getSavedStory(id) {
    const db = await dbPromise;
    return db.get(STORE_SAVED, id);
  },

  async deleteSavedStory(id) {
    const db = await dbPromise;
    return db.delete(STORE_SAVED, id);
  },

  // === OFFLINE PENDING STORIES ===
  async saveOfflineStory(story) {
    const db = await dbPromise;
    // story object contains description, photo (Blob), lat, lon, createdAt
    return db.add(STORE_OFFLINE, story);
  },

  async getOfflineStories() {
    const db = await dbPromise;
    return db.getAll(STORE_OFFLINE);
  },

  async deleteOfflineStory(id) {
    const db = await dbPromise;
    return db.delete(STORE_OFFLINE, id);
  },
};

export default DbHelper;
