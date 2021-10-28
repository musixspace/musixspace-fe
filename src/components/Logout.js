import { useEffect } from "react";
import { useHistory } from "react-router";
import { useSetRecoilState } from "recoil";
import { loadingAtom } from "../recoil/loadingAtom";
import { surpriseTracksAtom } from "../recoil/surpriseTracksAtom";
import { topArtistsAtom } from "../recoil/topArtistsAtom";
import { topTracksAtom } from "../recoil/topTracksAtom";
import { userState } from "../recoil/userAtom";

const Logout = () => {
  const setTracks = useSetRecoilState(topTracksAtom);
  const setArtists = useSetRecoilState(topArtistsAtom);
  const setRecommendations = useSetRecoilState(surpriseTracksAtom);
  const setUser = useSetRecoilState(userState);
  const setLoading = useSetRecoilState(loadingAtom);

  const history = useHistory();

  useEffect(() => {
    setLoading(true);
    setUser({ username: "" });
    setTracks({ tracks: null, images: null });
    setArtists({ artists: null, images: null });
    setRecommendations({ tracks: null, images: null });
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
