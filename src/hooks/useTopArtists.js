import { useRecoilState, useSetRecoilState } from "recoil";
import { loadingAtom } from "../recoil/loadingAtom";
import {
  topArtistsLongAtom,
  topArtistsMediumAtom,
  topArtistsShortAtom,
} from "../recoil/topArtistsAtom";
import { userState } from "../recoil/userAtom";
import { axiosInstance } from "../util/axiosConfig";

const useTopArtists = () => {
  const [user, setUser] = useRecoilState(userState);
  const setLoading = useSetRecoilState(loadingAtom);
  const setTALong = useSetRecoilState(topArtistsLongAtom);
  const setTAMedium = useSetRecoilState(topArtistsMediumAtom);
  const setTAShort = useSetRecoilState(topArtistsShortAtom);

  const getTopArtistsLong = (handle) => {
    setLoading(true);

    axiosInstance
      .post("/topartists_long")
      .then((res) => {
        if (res.status === 200) {
          const artists = res.data.artists;
          let imgArr = [];
          artists.forEach((artist) => {
            imgArr.push({
              id: artist.artist_id,
              url:
                artist.image_url ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRd-y-IJN8glQlf1qoU01dEgGPUa0d1-sjfWg&usqp=CAU",
            });
          });
          if (handle === user.username) {
            setUser({
              ...user,
              topArtistsLong: {
                artists: artists,
                images: imgArr,
              },
            });
          } else {
            setTALong({
              artists: artists,
              images: imgArr,
            });
          }

          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getTopArtistsMedium = (handle) => {
    setLoading(true);

    axiosInstance
      .post("/topartists_medium")
      .then((res) => {
        if (res.status === 200) {
          const artists = res.data.artists;
          let imgArr = [];
          artists.forEach((artist) => {
            imgArr.push({
              id: artist.artist_id,
              url:
                artist.image_url ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRd-y-IJN8glQlf1qoU01dEgGPUa0d1-sjfWg&usqp=CAU",
            });
          });
          if (handle === user.username) {
            setUser({
              ...user,
              topArtistsMedium: {
                artists: artists,
                images: imgArr,
              },
            });
          } else {
            setTAMedium({
              artists: artists,
              images: imgArr,
            });
          }

          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getTopArtistsShort = (handle) => {
    setLoading(true);

    axiosInstance
      .post("/topartists_short")
      .then((res) => {
        if (res.status === 200) {
          const artists = res.data.artists;
          let imgArr = [];
          artists.forEach((artist) => {
            imgArr.push({
              id: artist.artist_id,
              url:
                artist.image_url ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRd-y-IJN8glQlf1qoU01dEgGPUa0d1-sjfWg&usqp=CAU",
            });
          });
          if (handle === user.username) {
            setUser({
              ...user,
              topArtistsShort: {
                artists: artists,
                images: imgArr,
              },
            });
          } else {
            setTAShort({
              artists: artists,
              images: imgArr,
            });
          }

          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return { getTopArtistsLong, getTopArtistsMedium, getTopArtistsShort };
};

export default useTopArtists;
