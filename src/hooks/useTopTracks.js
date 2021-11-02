import { useSetRecoilState } from "recoil";
import { loadingAtom } from "../recoil/loadingAtom";
import { surpriseTracksAtom } from "../recoil/surpriseTracksAtom";
import {
  topTracksLongAtom,
  topTracksMediumAtom,
  topTracksShortAtom,
} from "../recoil/topTracksAtom";
import { axiosInstance } from "../util/axiosConfig";

const useTopTracks = () => {
  const setLoading = useSetRecoilState(loadingAtom);
  const setTTLong = useSetRecoilState(topTracksLongAtom);
  const setTTMedium = useSetRecoilState(topTracksMediumAtom);
  const setTTShort = useSetRecoilState(topTracksShortAtom);
  const setRecommendations = useSetRecoilState(surpriseTracksAtom);

  const getTopTracksLong = () => {
    setLoading(true);
    axiosInstance
      .post("toptracks_long")
      .then((res) => {
        if (res.status === 200) {
          const songs = res.data.songs;
          let imgArr = [];
          songs.forEach((item) => {
            imgArr.push({ id: item.song_id, url: item.image_url });
          });
          setTTLong({
            tracks: songs,
            images: imgArr,
          });
          setLoading(false);
        }
      })
      .catch((err) => console.log(err));
  };

  const getTopTracksMedium = () => {
    setLoading(true);
    axiosInstance
      .post("toptracks_medium")
      .then((res) => {
        if (res.status === 200) {
          const songs = res.data.songs;
          setTTMedium(songs);
          setLoading(false);
        }
      })
      .catch((err) => console.log(err));
  };

  const getTopTracksShort = () => {
    setLoading(true);
    axiosInstance
      .post("toptracks_short")
      .then((res) => {
        if (res.status === 200) {
          const songs = res.data.songs;
          setTTShort(songs);
          setLoading(false);
        }
      })
      .catch((err) => console.log(err));
  };

  const getRecommendations = () => {
    setLoading(true);
    axiosInstance
      .post("/recommendation")
      .then((res) => {
        const songs = res.data.songs;
        let imgArr = [];
        songs.forEach((song) => {
          imgArr.push({ id: song.song_id, url: song.image_url });
        });
        setRecommendations({
          tracks: songs,
          images: imgArr,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return {
    getTopTracksLong,
    getTopTracksMedium,
    getTopTracksShort,
    getRecommendations,
  };
};

export default useTopTracks;
