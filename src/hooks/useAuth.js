import { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { loadingAtom } from "../recoil/loadingAtom";
import { axiosInstance } from "../util/axiosConfig";

const useAuth = (code) => {
  const [accessToken, setAccessToken] = useState(null);
  const setLoading = useSetRecoilState(loadingAtom);
  useEffect(() => {
    if (code) {
      setLoading(true);
      axiosInstance
        .post(
          "/login",
          {
            code,
            redirect_uri: process.env.REACT_APP_REDIRECT_URI,
          },
          { timeout: 15000 }
        )
        .then((response) => {
          setAccessToken(response.data.accessToken);
          localStorage.setItem("accessToken", response.data.accessToken);
          localStorage.setItem("spotifyId", response.data.spotifyId);
          localStorage.setItem("handle", response.data.handle);
          sessionStorage.setItem("newUser", response.data.isNew);
          console.log(response.data.isNew);
          if (response.data.isNew) {
            console.log(window.location.origin);
            window.location.href = window.location.origin + "/readytorock";
          } else {
            window.location.href = window.location.origin + "/insights";
          }
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          window.location = "/";
        });
    }
  }, [code]);

  return { accessToken };
};

export default useAuth;
