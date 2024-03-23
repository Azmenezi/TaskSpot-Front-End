import axios from "axios";
import { getToken } from "./storage";

// const BASE_URL = "http://localhost:8080/api";
const BASE_URL = "http://192.168.1.202:8080/api";

const instance = axios.create({
  baseURL: BASE_URL,
});

instance.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { instance, BASE_URL };
