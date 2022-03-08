import axios from "axios";
import { _fn } from "./recoilAccesor";

export const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URI}`,
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
    if (error?.response?.status === 401) {
      if ((error.response.data.msg = "Session Expired!")) {
        _fn({
          open: true,
          message: "Session Expired",
          type: "error",
        });
        setTimeout(() => {
          window.location.href = window.location.origin + "/logout";
        }, 0);
      }
    }
    return Promise.reject(error);
  }
);
