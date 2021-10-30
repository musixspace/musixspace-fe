import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useRecoilState, useSetRecoilState } from "recoil";
import ArtistList from "../components/ArtistList";
import Carousel from "../components/Carousel";
import WebPlayer from "../components/WebPlayer";
import { loadingAtom } from "../recoil/loadingAtom";
import { topArtistsAtom } from "../recoil/topArtistsAtom";
import { axiosInstance } from "../util/axiosConfig";

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

              setTopArtistsInfo({
                artists: artists,
                images: imgArr,
              });
              setCurrentArtist(artists[0].artist_id);
              setLoading(false);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        setCurrentArtist(topArtistsInfo.artists[0].artist_id);
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
    const newArtist = topArtistsInfo.artists.filter(
      (artist) => artist.artist_id === artistId
    );

    let songUrl = null;
    for (let i = 0; i < newArtist[0].user_songs.length; i++) {
      if (newArtist[0].user_songs[i].preview_url) {
        songUrl = newArtist[0].user_songs[i].preview_url;
        break;
      }
    }

    if (songUrl) {
      setAudioUrl(songUrl);
    } else {
      handleNextPlay();
    }
  };

  const handleArtistChange = (artistId) => {
    setCurrentArtist(artistId);
  };

  const handlePrevPlay = () => {
    let index;
    topArtistsInfo.artists.forEach((item, ind) => {
      if (item.artist_id === currentArtist) {
        index = ind;
      }
    });

    // console.log(index);

    if (index === 0) {
      setCurrentArtist(
        topArtistsInfo.artists[topArtistsInfo.artists.length - 1].artist_id
      );
    } else {
      setCurrentArtist(topArtistsInfo.artists[index - 1].artist_id);
    }
  };

  const handleNextPlay = () => {
    let index;
    topArtistsInfo.artists.forEach((item, ind) => {
      if (item.artist_id === currentArtist) {
        index = ind;
      }
    });

    // console.log(index);

    if (index === topArtistsInfo.artists.length - 1) {
      setCurrentArtist(topArtistsInfo.artists[0].artist_id);
    } else {
      setCurrentArtist(topArtistsInfo.artists[index + 1].artist_id);
    }
  };

  const handleShufflePlay = () => {
    let total = topArtistsInfo.artists.length;
    let rnd = Math.floor(Math.random() * total);
    setCurrentArtist(topArtistsInfo.artists[rnd].artist_id);
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
