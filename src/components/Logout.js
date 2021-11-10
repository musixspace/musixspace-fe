import { useEffect } from "react";
import { useHistory } from "react-router";
import { useResetRecoilState, useSetRecoilState } from "recoil";
import { alertAtom } from "../recoil/alertAtom";
import { loadingAtom } from "../recoil/loadingAtom";
import { surpriseTracksAtom } from "../recoil/surpriseTracksAtom";
import {
  topArtistsLongAtom,
  topArtistsMediumAtom,
  topArtistsShortAtom,
} from "../recoil/topArtistsAtom";
import {
  topTracksLongAtom,
  topTracksMediumAtom,
  topTracksShortAtom,
} from "../recoil/topTracksAtom";
import { userState } from "../recoil/userAtom";

const Logout = () => {
  const resetTracksLong = useResetRecoilState(topTracksLongAtom);
  const resetTracksMedium = useResetRecoilState(topTracksMediumAtom);
  const resetTracksShort = useResetRecoilState(topTracksShortAtom);
  const resetArtistsLong = useResetRecoilState(topArtistsLongAtom);
  const resetArtistsMedium = useResetRecoilState(topArtistsMediumAtom);
  const resetArtistsShort = useResetRecoilState(topArtistsShortAtom);
  const resetRecommendations = useResetRecoilState(surpriseTracksAtom);
  const resetUser = useResetRecoilState(userState);
  const setLoading = useSetRecoilState(loadingAtom);
  const setAlert = useSetRecoilState(alertAtom);

  const history = useHistory();

  useEffect(() => {
    setLoading(true);
    setAlert({ open: true, message: "Logging you out...", type: "success" });
    resetTracksLong();
    resetTracksMedium();
    resetTracksShort();
    resetArtistsLong();
    resetArtistsMedium();
    resetArtistsShort();
    resetRecommendations();
    resetUser();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("spotifyId");
    sessionStorage.removeItem("newUser");
    setTimeout(() => {
      setLoading(false);
      history.push("/");
    }, 4000);
  }, []);

  return null;
};

export default Logout;
