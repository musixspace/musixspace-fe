import axios from "axios";
import { useEffect, useState } from "react";

const useAuth = (code) => {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    if (code) {
      axios
        .post(`${process.env.REACT_APP_BACKEND_URI}/login`, { code })
        .then((response) => {
          window.history.pushState({}, null, "/");
          console.log(response.data);
          setAccessToken(response.data.accessToken);
        })
        .catch((err) => {
          console.log(err);
          window.location = "/";
        });
    }
  }, [code]);

  return accessToken;
};

export default useAuth;
