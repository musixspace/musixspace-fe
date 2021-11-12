import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URI}`,
  // timeout: 1000,
});

axiosInstance.interceptors.request.use(
  function (config) {
    config.headers = {
      ...config.headers,
      jwttoken: localStorage.getItem("accessToken"),
      "Content-Type": "application/json",
    };
    config.data = {
      ...config.data,
      spotify_id: localStorage.getItem("spotifyId"),
    };
    return config;
  },
  function (error) {
    console.log(error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    console.log(error.response);
    if (error.response.status >= 400 && error.response.status < 500) {
      window.location.href = window.location.origin + "/logout";
    }
    return Promise.reject(error);
  }
);
