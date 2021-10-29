import { useEffect } from "react";
import { useHistory } from "react-router";
import { useResetRecoilState, useSetRecoilState } from "recoil";
import { loadingAtom } from "../recoil/loadingAtom";
import { surpriseTracksAtom } from "../recoil/surpriseTracksAtom";
import { topArtistsAtom } from "../recoil/topArtistsAtom";
import { topTracksAtom } from "../recoil/topTracksAtom";
import { userState } from "../recoil/userAtom";

const Logout = () => {
  const resetTracks = useResetRecoilState(topTracksAtom);
  const resetArtists = useResetRecoilState(topArtistsAtom);
  const resetRecommendations = useResetRecoilState(surpriseTracksAtom);
  const resetUser = useResetRecoilState(userState);
  const setLoading = useSetRecoilState(loadingAtom);

  const history = useHistory();

  useEffect(() => {
    setLoading(true);
    resetTracks();
    resetArtists();
    resetRecommendations();
    resetUser();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("spotifyId");
    setTimeout(() => {
      setLoading(false);
      history.push("/");
    }, 2000);
  }, []);

  return null;
};

export default Logout;
