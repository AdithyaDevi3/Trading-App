import * as SecureStore from 'expo-secure-store';

// Use Expo SecureStore which works with Expo Go without native prebuild
export default {
  async get(key) {
    try {
      const v = await SecureStore.getItemAsync(key);
      return v ? JSON.parse(v) : null;
    } catch (e) {
      console.warn('storage.get', e);
      return null;
    }
  },
  async set(key, value) {
    try {
      await SecureStore.setItemAsync(key, JSON.stringify(value));
    } catch (e) {
      console.warn('storage.set', e);
    }
  }
};
