import axios from "axios";
import { handleLogout } from "./functions";

export const axiosInstance = axios.create({
  baseURL: "https://api.spotify.com/v1",
  timeout: 1000,
});

axiosInstance.interceptors.request.use(
  function (config) {
    config.headers = {
      ...config.headers,
      Authorization: "Bearer " + localStorage.getItem("accessToken"),
      "Content-Type": "application/json",
    };
    // you can also do other modification in config
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    if (response.status === 401) {
      handleLogout();
    }
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);
