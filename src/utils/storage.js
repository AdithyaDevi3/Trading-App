import AsyncStorage from '@react-native-async-storage/async-storage';

export default {
  async get(key) {
    try {
      const v = await AsyncStorage.getItem(key);
      return v ? JSON.parse(v) : null;
    } catch (e) {
      console.warn('storage.get', e);
      return null;
    }
  },
  async set(key, value) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('storage.set', e);
    }
  }
};
