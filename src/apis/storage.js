import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

const getToken = async () => {
  return await SecureStore.getItemAsync("token");
};
const storeToken = async (token) => {
  await SecureStore.setItemAsync("token", token);
};
const removeToken = async () => {
  await SecureStore.deleteItemAsync("token");
};

const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    // saving error
    console.log(e);
  }
};

const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
    console.log(e);
  }
};
export { getToken, storeToken, removeToken, storeData, getData };
