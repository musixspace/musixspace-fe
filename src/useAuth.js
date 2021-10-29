import axios from "axios";
import { useEffect, useState } from "react";
import { axiosInstance } from "./util/axiosConfig";

const useAuth = (code) => {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    if (code) {
      axiosInstance
        .post("/login", { code })
        .then((response) => {
          window.history.pushState({}, null, "/");
          console.log(response.data);
          setAccessToken(response.data.accessToken);
          localStorage.setItem("accessToken", response.data.accessToken);
          localStorage.setItem("spotifyId", response.data.spotifyId);
          if (response.data.isNew) {
            window.location.href = window.location.origin + "/readytorock";
          } else {
            window.location.href = window.location.origin + "/insights";
          }
        })
        .catch((err) => {
          console.log(err);
          window.location = "/";
        });
    }
  }, [code]);

  // Update 'accessToken' with the help of 'refreshToken' when 'expireIn' time expires
  // Because of this user doesnot have to reLogin after(in this case 3600s = 1hr) its accessToken expires because below code will updates accessToken
  // useEffect(() => {
  //   if (!refreshToken || !expiresIn) {
  //     return;
  //   }

  //   let interval = setInterval(() => {
  //     axios
  //       .post(`${process.env.REACT_APP_BACKEND_URI}/refresh`, { refreshToken })
  //       .then((response) => {
  //         // console.log(response.data);
  //         setAccessToken(response.data.accessToken);
  //         setExpiresIn(response.data.expiresIn);
  //       })
  //       .catch(() => {
  //         window.location = "/";
  //       });
  //   }, (expiresIn - 60) * 1000); // 1 min before expire Time and multiplying it with 1000 becoz to convert it in miliseconds

  //   // This will make sure that if for some reason our refreshtoken or expireTime changes before an actual Refresh then it will clear the interval so that we don't use the incorrect expireTime or refreshtoken
  //   return () => clearInterval(interval);
  // }, [refreshToken, expiresIn]);

  return { accessToken };
};

export default useAuth;
