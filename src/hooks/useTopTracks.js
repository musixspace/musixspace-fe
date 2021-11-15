import { useRecoilState, useSetRecoilState } from "recoil";
import { loadingAtom } from "../recoil/loadingAtom";
import { surpriseTracksAtom } from "../recoil/surpriseTracksAtom";
import {
  topTracksLongAtom,
  topTracksMediumAtom,
  topTracksShortAtom,
} from "../recoil/topTracksAtom";
import { userState } from "../recoil/userAtom";
import { axiosInstance } from "../util/axiosConfig";

const useTopTracks = () => {
  const [user, setUser] = useRecoilState(userState);
  const setLoading = useSetRecoilState(loadingAtom);
  const setTTLong = useSetRecoilState(topTracksLongAtom);
  const setTTMedium = useSetRecoilState(topTracksMediumAtom);
  const setTTShort = useSetRecoilState(topTracksShortAtom);
  const setRecommendations = useSetRecoilState(surpriseTracksAtom);

  const getTopTracksLong = (handle) => {
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
          if (handle === user.username) {
            setUser({
              ...user,
              topTracksLong: {
                images: imgArr,
                tracks: songs,
              },
            });
          } else {
            setTTLong({
              tracks: songs,
              images: imgArr,
            });
          }

          setLoading(false);
        }
      })
      .catch((err) => console.log(err));
  };

  const getTopTracksMedium = (handle) => {
    setLoading(true);
    axiosInstance
      .post("toptracks_medium")
      .then((res) => {
        if (res.status === 200) {
          const songs = res.data.songs;
          let imgArr = [];
          songs.forEach((item) => {
            imgArr.push({ id: item.song_id, url: item.image_url });
          });
          if (handle === user.username) {
            setUser({
              ...user,
              topTracksMedium: {
                images: imgArr,
                tracks: songs,
              },
            });
          } else {
            setTTMedium({
              tracks: songs,
              images: imgArr,
            });
          }

          setLoading(false);
        }
      })
      .catch((err) => console.log(err));
  };

  const getTopTracksShort = (handle) => {
    setLoading(true);

    axiosInstance
      .post("toptracks_short")
      .then((res) => {
        if (res.status === 200) {
          const songs = res.data.songs;
          let imgArr = [];
          songs.forEach((item) => {
            imgArr.push({ id: item.song_id, url: item.image_url });
          });
          if (handle === user.username) {
            setUser({
              ...user,
              topTracksShort: {
                images: imgArr,
                tracks: songs,
              },
            });
          } else {
            setTTShort({
              tracks: songs,
              images: imgArr,
            });
          }

          setLoading(false);
        }
      })
      .catch((err) => console.log(err));
  };

  const getRecommendations = (handle) => {
    setLoading(true);

    axiosInstance
      .post("/recommendation")
      .then((res) => {
        const songs = res.data.songs;
        let imgArr = [];
        songs.forEach((song) => {
          imgArr.push({ id: song.song_id, url: song.image_url });
        });
        if (handle === user.username) {
          setUser({
            ...user,
            surpriseTracks: {
              images: imgArr,
              tracks: songs,
            },
          });
        } else {
          setRecommendations({
            tracks: songs,
            images: imgArr,
          });
        }

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
