import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useRecoilState, useSetRecoilState } from "recoil";
import ArtistList from "../components/ArtistList";
import Carousel from "../components/Carousel";
import WebPlayer from "../components/WebPlayer";
import { loadingAtom } from "../recoil/loadingAtom";
import { topArtistsAtom } from "../recoil/topArtistsAtom";

const TopArtists = () => {
  const history = useHistory();
  const setLoading = useSetRecoilState(loadingAtom);

  const [currentArtist, setCurrentArtist] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [topArtistsInfo, setTopArtistsInfo] = useRecoilState(topArtistsAtom);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      if (!topArtistsInfo.artists) {
        setLoading(true);
        const payload = {
          pip: "https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=30",
          spotify_id: localStorage.getItem("spotifyId"),
        };

        axios
          .post(`${process.env.REACT_APP_BACKEND_URI}/spotifyget`, payload, {
            headers: {
              jwt_token: localStorage.getItem("accessToken"),
            },
          })
          .then((res) => {
            if (res.status === 200) {
              let imgArr = [];
              res.data.items.forEach((item) => {
                imgArr.push({
                  id: item.id,
                  url:
                    item.images.length >= 1
                      ? item.images[0].url
                      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRd-y-IJN8glQlf1qoU01dEgGPUa0d1-sjfWg&usqp=CAU",
                });
              });
              setTopArtistsInfo({
                artists: res.data.items,
                images: imgArr,
              });
              setCurrentArtist(res.data.items[0].id);
            }
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setCurrentArtist(topArtistsInfo.artists[0].id);
      }
    } else {
      history.push("/");
    }
  }, []);

  useEffect(() => {
    if (currentArtist) {
      changeArtist(currentArtist);
    }
  }, [currentArtist]);

  const changeArtist = (artistId) => {
    const payload = {
      pip: `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=IN`,
      spotify_id: localStorage.getItem("spotifyId"),
    };

    axios
      .post(`${process.env.REACT_APP_BACKEND_URI}/spotifyget`, payload, {
        headers: {
          //"Content-Type": "application/json",
          jwt_token: localStorage.getItem("accessToken"),
        },
      })
      .then((res) => {
        if (res.status === 200) {
          let url = "";
          const tracks = res.data.tracks;
          for (let i = 0; i < tracks.length; i++) {
            if (tracks[i].preview_url) {
              url = tracks[i].preview_url;
              break;
            }
          }
          setCurrentArtist(artistId);
          if (url) {
            setAudioUrl(url);
          } else {
            handleNextPlay();
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleArtistChange = (artistId) => {
    setCurrentArtist(artistId);
  };

  const handlePrevPlay = () => {
    let index;
    topArtistsInfo.artists.forEach((item, ind) => {
      if (item.id === currentArtist) {
        index = ind;
      }
    });

    // console.log(index);

    if (index === 0) {
      setCurrentArtist(
        topArtistsInfo.artists[topArtistsInfo.artists.length - 1].id
      );
    } else {
      setCurrentArtist(topArtistsInfo.artists[index - 1].id);
    }
  };

  const handleNextPlay = () => {
    let index;
    topArtistsInfo.artists.forEach((item, ind) => {
      if (item.id === currentArtist) {
        index = ind;
      }
    });

    // console.log(index);

    if (index === topArtistsInfo.artists.length - 1) {
      setCurrentArtist(topArtistsInfo.artists[0].id);
    } else {
      setCurrentArtist(topArtistsInfo.artists[index + 1].id);
    }
  };

  const handleShufflePlay = () => {
    let total = topArtistsInfo.artists.length;
    let rnd = Math.floor(Math.random() * total);
    setCurrentArtist(topArtistsInfo.artists[rnd].id);
  };

  return (
    <div className="dashboard-container">
      {topArtistsInfo.artists &&
        topArtistsInfo.artists.length > 0 &&
        currentArtist && (
          <div className="dashboard">
            <div>
              <ArtistList
                currentArtist={currentArtist}
                artists={topArtistsInfo.artists}
                changeArtist={handleArtistChange}
              />
              <WebPlayer
                url={audioUrl}
                prevPlay={handlePrevPlay}
                nextPlay={handleNextPlay}
                shufflePlay={handleShufflePlay}
              />
            </div>
            <Carousel data={topArtistsInfo.images} current={currentArtist} />
            <div className="heading">
              <p>Your Top Artists Radio</p>
            </div>
          </div>
        )}
    </div>
  );
};

export default TopArtists;
