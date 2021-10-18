import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import Carousel from "../components/Carousel";
import Navbar from "../components/Navbar";
import TrackList from "../components/TrackList";
import WebPlayer from "../components/WebPlayer";
import { spotifyApi } from "../util/spotify";

const SurpriseMe = () => {
  const history = useHistory();
  const [topRecommendations, setTopRecommendations] = useState(null);
  const [currentTrack, setCurrentTrack] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [images, setImages] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      spotifyApi.setAccessToken(accessToken);
      spotifyApi
        .getMyTopArtists({ time_range: "long_term", limit: 30 })
        .then((res) => {
          console.log(res);
          const artists = res.body.items.map((artist) => artist.id).slice(0, 5);

          spotifyApi
            .getRecommendations({
              min_energy: 0.4,
              seed_artists: artists,
              min_popularity: 50,
            })
            .then((topTracks) => {
              console.log(topTracks);
              let imgArr = [];
              topTracks.body.tracks.forEach((item) => {
                imgArr.push({ id: item.id, url: item.album.images[0].url });
              });
              setImages(imgArr);
              setTopRecommendations(topTracks.body.tracks);
              setCurrentTrack(topTracks.body.tracks[0].id);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      history.push("/");
    }
  }, []);

  useEffect(() => {
    if (currentTrack) {
      changeTrack(currentTrack);
    }
  }, [currentTrack]);

  const changeTrack = (trackId) => {
    spotifyApi
      .getTrack(trackId, { market: "IN" })
      .then((res) => {
        // console.log(res);
        setCurrentTrack(trackId);
        if (res.body.preview_url) {
          setAudioUrl(res.body.preview_url);
        } else {
          handleNextPlay();
        }
      })
      .catch((err) => console.log(err));
  };

  const handleTrackChange = (trackId) => {
    setCurrentTrack(trackId);
  };

  const handlePrevPlay = () => {
    let index;
    topRecommendations.forEach((item, ind) => {
      if (item.id === currentTrack) {
        index = ind;
      }
    });

    // console.log(index);

    if (index === 0) {
      setCurrentTrack(topRecommendations[topRecommendations.length - 1].id);
    } else {
      setCurrentTrack(topRecommendations[index - 1].id);
    }
  };

  const handleNextPlay = () => {
    let index;
    topRecommendations.forEach((item, ind) => {
      if (item.id === currentTrack) {
        index = ind;
      }
    });

    // console.log(index);

    if (index === topRecommendations.length - 1) {
      setCurrentTrack(topRecommendations[0].id);
    } else {
      setCurrentTrack(topRecommendations[index + 1].id);
    }
  };

  const handleShufflePlay = () => {
    let total = topRecommendations.length;
    let rnd = Math.floor(Math.random() * total);
    setCurrentTrack(topRecommendations[rnd].id);
  };

  return (
    <div
      className="wrapper"
      style={{ backgroundColor: "var(--bg-top-tracks)" }}
    >
      <Navbar />
      <div className="dashboard-container">
        {topRecommendations && topRecommendations.length > 0 && currentTrack && (
          <div className="dashboard">
            <div>
              <TrackList
                currentTrack={currentTrack}
                tracks={topRecommendations}
                changeTrack={handleTrackChange}
              />
              <WebPlayer
                url={audioUrl}
                prevPlay={handlePrevPlay}
                nextPlay={handleNextPlay}
                shufflePlay={handleShufflePlay}
              />
            </div>
            <Carousel data={images} current={currentTrack} />
            <div className="heading">
              <p>Top Surprise Tracks Radio</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SurpriseMe;
