import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import SpotifyWebApi from "spotify-web-api-node";
import Carousel from "../../components/Carousel/Carousel";
import TrackList from "../../components/TrackList/TrackList";
import WebPlayer from "../../components/WebPlayer/WebPlayer";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.REACT_APP_CLIENT_ID,
  clientSecret: process.env.REACT_REDIRECT_URI,
  redirectUri: process.env.REACT_REDIRECT_URI,
});

const Dashboard = () => {
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
          let imgObj = {};
          res.body.items.forEach((item) => {
            imgObj[item.id] = item.album.images[0].url;
          });
          setImages(imgObj);
          setTopTracks(res.body.items);
          setCurrentTrack(res.body.items[0].id);
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
        console.log(res);
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
          <Carousel data={images} currentTrack={currentTrack} />
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
  );
};

export default Dashboard;
