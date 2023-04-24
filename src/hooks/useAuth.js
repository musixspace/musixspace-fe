import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { loadingAtom } from "../recoil/loadingAtom";
import { alertAtom } from "../recoil/alertAtom";
import { userState } from "../recoil/userAtom";
import { axiosInstance } from "../util/axiosConfig";

const useAuth = (code) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useRecoilState(userState);
  const setLoading = useSetRecoilState(loadingAtom);
  const setAlert = useSetRecoilState(alertAtom);

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
          { timeout: 60000 }
        )
        .then((response) => {
          if (!response.data.spotifyId){
            window.location.href = window.location.origin + "/no_listening_history";
          }
          setAccessToken(response.data.accessToken);
          setUser({ ...user, isAuthenticated: true });
          localStorage.setItem("accessToken", response.data.accessToken);
          localStorage.setItem("spotifyId", response.data.spotifyId);
          localStorage.setItem("handle", response.data.handle);
          sessionStorage.setItem("newUser", response.data.isNew);
          console.log(response.data.isNew);
          if (response.data.isNew) {
            console.log(window.location.origin);
            window.location.href = window.location.origin + "/readytorock";
          } else {
            window.location.href = window.location.origin + "/"+response.data.handle;
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
