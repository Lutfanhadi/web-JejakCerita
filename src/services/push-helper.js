import CONFIG from '../data/config';
import StoryApi from '../api/story-api';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const PushHelper = {
  async getSubscription() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return null;
    }
    const registration = await navigator.serviceWorker.ready;
    return registration.pushManager.getSubscription();
  },

  async isEnabled() {
    const subscription = await this.getSubscription();
    return !!subscription;
  },

  async enableNotification() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      throw new Error('Push notification is not supported in this browser.');
    }

    // 1. Request Permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Notification permission denied.');
    }

    // 2. Subscribe Push Manager
    const registration = await navigator.serviceWorker.ready;
    const subscribeOptions = {
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(CONFIG.VAPID_PUBLIC_KEY),
    };

    const subscription = await registration.pushManager.subscribe(subscribeOptions);

    // 3. Send subscription to API (remove expirationTime to avoid backend Joi validation error)
    const subscriptionJson = subscription.toJSON();
    delete subscriptionJson.expirationTime;

    const response = await StoryApi.subscribeNotification(subscriptionJson);
    if (response.error) {
      // Rollback if API fails
      await subscription.unsubscribe();
      throw new Error(response.message || 'Failed to register subscription on server.');
    }

    return subscription;
  },

  async disableNotification() {
    const subscription = await this.getSubscription();
    if (subscription) {
      // 1. Unsubscribe from browser PushManager
      await subscription.unsubscribe();

      // 2. Call API to remove subscription
      try {
        await StoryApi.unsubscribeNotification();
      } catch (err) {
        console.error('Failed to notify backend about unsubscribe:', err);
      }
    }
  },
};

export default PushHelper;
