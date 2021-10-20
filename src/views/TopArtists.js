import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import ArtistList from "../components/ArtistList";
import Carousel from "../components/Carousel";
import Navbar from "../components/Navbar";
import WebPlayer from "../components/WebPlayer";
import { handleLogout } from "../util/functions";
import { spotifyApi } from "../util/spotify";

const TopArtists = () => {
  const history = useHistory();

  const [topArtists, setTopArtists] = useState(null);
  const [images, setImages] = useState(null);
  const [currentArtist, setCurrentArtist] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      spotifyApi.setAccessToken(accessToken);
      spotifyApi
        .getMyTopArtists({ time_range: "long_term", limit: 30 })
        .then((res) => {
          console.log(res);
          let imgArr = [];
          res.body.items.forEach((item) => {
            imgArr.push({
              id: item.id,
              url:
                item.images.length >= 1
                  ? item.images[0].url
                  : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRd-y-IJN8glQlf1qoU01dEgGPUa0d1-sjfWg&usqp=CAU",
            });
          });
          setImages(imgArr);
          setTopArtists(res.body.items);
          setCurrentArtist(res.body.items[0].id);
        })
        .catch((err) => {
          console.log(err);
          if (err?.body?.error?.status === 401) {
            handleLogout();
          }
        });
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
    spotifyApi
      .getArtistTopTracks(artistId, "IN")
      .then((res) => {
        console.log(res);
        let url = "";
        const tracks = res.body.tracks;
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
      })
      .catch((err) => {
        console.log(err);
        if (err?.body?.error?.status === 401) {
          handleLogout();
        }
      });
  };

  const handleArtistChange = (artistId) => {
    setCurrentArtist(artistId);
  };

  const handlePrevPlay = () => {
    let index;
    topArtists.forEach((item, ind) => {
      if (item.id === currentArtist) {
        index = ind;
      }
    });

    // console.log(index);

    if (index === 0) {
      setCurrentArtist(topArtists[topArtists.length - 1].id);
    } else {
      setCurrentArtist(topArtists[index - 1].id);
    }
  };

  const handleNextPlay = () => {
    let index;
    topArtists.forEach((item, ind) => {
      if (item.id === currentArtist) {
        index = ind;
      }
    });

    // console.log(index);

    if (index === topArtists.length - 1) {
      setCurrentArtist(topArtists[0].id);
    } else {
      setCurrentArtist(topArtists[index + 1].id);
    }
  };

  const handleShufflePlay = () => {
    let total = topArtists.length;
    let rnd = Math.floor(Math.random() * total);
    setCurrentArtist(topArtists[rnd].id);
  };

  return (
    <div
      className="wrapper"
      style={{ backgroundColor: "var(--bg-top-tracks)" }}
    >
      <Navbar />
      <div className="dashboard-container">
        {topArtists && topArtists.length > 0 && currentArtist && (
          <div className="dashboard">
            <div>
              <ArtistList
                currentArtist={currentArtist}
                artists={topArtists}
                changeArtist={handleArtistChange}
              />
              <WebPlayer
                url={audioUrl}
                prevPlay={handlePrevPlay}
                nextPlay={handleNextPlay}
                shufflePlay={handleShufflePlay}
              />
            </div>
            <Carousel data={images} current={currentArtist} />
            <div className="heading">
              <p>Your Top Artists Radio</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopArtists;
