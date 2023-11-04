import * as SecureStore from "expo-secure-store";

const getToken = async () => {
  return await SecureStore.getItemAsync("token");
};
const storeToken = async (token) => {
  await SecureStore.setItemAsync("token", token);
};
const removeToken = async () => {
  await SecureStore.deleteItemAsync("token");
};

export { getToken, storeToken, removeToken };
