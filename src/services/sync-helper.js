import DbHelper from '../db/db-helper';
import StoryApi from '../api/story-api';

const SyncHelper = {
  async registerSync() {
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('sync-offline-stories');
        console.log('Background Sync tag "sync-offline-stories" registered');
      } catch (err) {
        console.warn('Background Sync registration failed. Syncing directly:', err);
        await this.syncStoriesDirectly();
      }
    } else {
      console.log('Background Sync API not supported. Syncing directly.');
      await this.syncStoriesDirectly();
    }
  },

  async syncStoriesDirectly() {
    const stories = await DbHelper.getOfflineStories();
    if (stories.length === 0) return;

    let successCount = 0;
    for (const story of stories) {
      try {
        const formData = new FormData();
        formData.append('description', story.description);
        formData.append('photo', story.photo, 'offline_photo.jpg');
        
        if (story.lat && story.lon) {
          formData.append('lat', story.lat);
          formData.append('lon', story.lon);
        }

        // Send request with the token stored inside the story object
        const token = story.token || localStorage.getItem('authToken');
        
        // Custom request wrapper to ensure correct auth header
        const response = await fetch('https://story-api.dicoding.dev/v1/stories', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const responseData = await response.json();
        if (!responseData.error) {
          await DbHelper.deleteOfflineStory(story.id);
          successCount++;
        }
      } catch (err) {
        console.error('Failed to sync offline story directly:', err);
      }
    }

    if (successCount > 0) {
      this.showToast(`Sinkronisasi Berhasil! ${successCount} story offline Anda telah diunggah.`);
      // Dispatch event to refresh list views
      window.dispatchEvent(new CustomEvent('stories-synced'));
    }
  },

  showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    toast.textContent = message;

    container.appendChild(toast);

    // Fade and slide in
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    // Fade and slide out
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 4000);
  },
};

export default SyncHelper;
