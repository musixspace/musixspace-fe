import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useResetRecoilState, useSetRecoilState } from "recoil";
import { alertAtom } from "../recoil/alertAtom";
import { loadingAtom } from "../recoil/loadingAtom";
import { discoverNumber, userState } from "../recoil/userAtom";

const Logout = () => {
  const resetDiscoverNumber = useResetRecoilState(discoverNumber);
  const resetUser = useResetRecoilState(userState);
  const setLoading = useSetRecoilState(loadingAtom);
  const setAlert = useSetRecoilState(alertAtom);

  const history = useHistory();

  useEffect(() => {
    setLoading(true);
    setAlert({ open: true, message: "Logging you out...", type: "success" });
    resetDiscoverNumber();
    resetUser();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("spotifyId");
    sessionStorage.removeItem("newUser");
    setTimeout(() => {
      setLoading(false);
      history.push("/");
    }, 5000);
  }, []);

  return null;
};

export default Logout;
