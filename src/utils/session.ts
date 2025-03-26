import AsyncStorage from '@react-native-async-storage/async-storage';

export const savePhone = async (phone: string) => {
  await AsyncStorage.setItem('PARENT_PHONE', phone);
};

export const getPhone = async () => {
  return await AsyncStorage.getItem('PARENT_PHONE');
};

export const clearSession = async () => {
  await AsyncStorage.removeItem('PARENT_PHONE');
};