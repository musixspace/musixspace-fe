import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import Carousel from "../components/Carousel";
import Navbar from "../components/Navbar";
import TrackList from "../components/TrackList";
import WebPlayer from "../components/WebPlayer";
import { handleLogout } from "../util/functions";
import { spotifyApi } from "../util/spotify";

const TopTracks = () => {
  const history = useHistory();
  const [topTracks, setTopTracks] = useState(null);
  const [currentTrack, setCurrentTrack] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [images, setImages] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      spotifyApi.setAccessToken(accessToken);
      spotifyApi
        .getMyTopTracks({ time_range: "long_term", limit: 30 })
        .then((res) => {
          console.log(res);
          let imgArr = [];
          res.body.items.forEach((item) => {
            imgArr.push({ id: item.id, url: item.album.images[0].url });
          });
          setImages(imgArr);
          setTopTracks(res.body.items);
          setCurrentTrack(res.body.items[0].id);
        })
        .catch((err) => {
          if (err?.body?.error?.status === 401) {
            handleLogout();
          }
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
        console.log(res);
        setCurrentTrack(trackId);
        if (res.body.preview_url) {
          setAudioUrl(res.body.preview_url);
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

  const handleTrackChange = (trackId) => {
    setCurrentTrack(trackId);
  };

  const handlePrevPlay = () => {
    let index;
    topTracks.forEach((item, ind) => {
      if (item.id === currentTrack) {
        index = ind;
      }
    });

    // console.log(index);

    if (index === 0) {
      setCurrentTrack(topTracks[topTracks.length - 1].id);
    } else {
      setCurrentTrack(topTracks[index - 1].id);
    }
  };

  const handleNextPlay = () => {
    let index;
    topTracks.forEach((item, ind) => {
      if (item.id === currentTrack) {
        index = ind;
      }
    });

    // console.log(index);

    if (index === topTracks.length - 1) {
      setCurrentTrack(topTracks[0].id);
    } else {
      setCurrentTrack(topTracks[index + 1].id);
    }
  };

  const handleShufflePlay = () => {
    let total = topTracks.length;
    let rnd = Math.floor(Math.random() * total);
    setCurrentTrack(topTracks[rnd].id);
  };

  return (
    <div
      className="wrapper"
      style={{ backgroundColor: "var(--bg-top-tracks)" }}
    >
      <Navbar />
      <div className="dashboard-container">
        {topTracks && topTracks.length > 0 && currentTrack && (
          <div className="dashboard">
            <div>
              <TrackList
                currentTrack={currentTrack}
                tracks={topTracks}
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
              <p>Your Top Tracks Radio</p>
              <div>
                <p>30 sec</p>
                <button id="export">Export</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopTracks;
