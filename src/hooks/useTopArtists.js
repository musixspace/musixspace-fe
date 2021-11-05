import { useSetRecoilState } from "recoil";
import { loadingAtom } from "../recoil/loadingAtom";
import {
  topArtistsLongAtom,
  topArtistsMediumAtom,
  topArtistsShortAtom,
} from "../recoil/topArtistsAtom";
import { axiosInstance } from "../util/axiosConfig";

const useTopArtists = () => {
  const setLoading = useSetRecoilState(loadingAtom);
  const setTALong = useSetRecoilState(topArtistsLongAtom);
  const setTAMedium = useSetRecoilState(topArtistsMediumAtom);
  const setTAShort = useSetRecoilState(topArtistsShortAtom);

  const getTopArtistsLong = (removeLoader) => {
    if (!removeLoader) {
      setLoading(true);
    }
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

          setTALong({
            artists: artists,
            images: imgArr,
          });
          if (!removeLoader) {
            setLoading(false);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getTopArtistsMedium = (removeLoader) => {
    if (!removeLoader) {
      setLoading(true);
    }
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

          setTAMedium({
            artists: artists,
            images: imgArr,
          });
          if (!removeLoader) {
            setLoading(false);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getTopArtistsShort = (removeLoader) => {
    if (!removeLoader) {
      setLoading(true);
    }
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

          setTAShort({
            artists: artists,
            images: imgArr,
          });
          if (!removeLoader) {
            setLoading(false);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return { getTopArtistsLong, getTopArtistsMedium, getTopArtistsShort };
};

export default useTopArtists;
