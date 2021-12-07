import { useRecoilState } from "recoil";
import { userState } from "../recoil/userAtom";
import { axiosInstance } from "../util/axiosConfig";

const useTopTracks = () => {
  const [user, setUser] = useRecoilState(userState);

  const getTopTracksLong = (handle) => {
    axiosInstance
      .get(`toptracks_long/${handle}`)
      .then((res) => {
        if (res.status === 200) {
          const songs = res.data.songs;
          let imgArr = [];
          songs.forEach((item) => {
            imgArr.push({ id: item.song_id, url: item.image_url });
          });
          setUser({
            ...user,
            topTracksLong: {
              images: imgArr,
              tracks: songs,
            },
          });
        }
      })
      .catch((err) => console.log(err));
  };

  const getTopTracksMedium = () => {
    axiosInstance
      .post("toptracks_medium")
      .then((res) => {
        if (res.status === 200) {
          const songs = res.data.songs;
          let imgArr = [];
          songs.forEach((item) => {
            imgArr.push({ id: item.song_id, url: item.image_url });
          });
          setUser({
            ...user,
            topTracksMedium: {
              images: imgArr,
              tracks: songs,
            },
          });
        }
      })
      .catch((err) => console.log(err));
  };

  const getTopTracksShort = () => {
    axiosInstance
      .post("toptracks_short")
      .then((res) => {
        if (res.status === 200) {
          const songs = res.data.songs;
          let imgArr = [];
          songs.forEach((item) => {
            imgArr.push({ id: item.song_id, url: item.image_url });
          });
          setUser({
            ...user,
            topTracksShort: {
              images: imgArr,
              tracks: songs,
            },
          });
        }
      })
      .catch((err) => console.log(err));
  };

  const getRecommendations = () => {
    axiosInstance
      .post("/recommendation")
      .then((res) => {
        const songs = res.data.songs;
        let imgArr = [];
        songs.forEach((song) => {
          imgArr.push({ id: song.song_id, url: song.image_url });
        });
        setUser({
          ...user,
          surpriseTracks: {
            images: imgArr,
            tracks: songs,
          },
        });
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
