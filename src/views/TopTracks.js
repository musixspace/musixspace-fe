import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useRecoilState, useSetRecoilState } from "recoil";
import Carousel from "../components/Carousel";
import TrackList from "../components/TrackList";
import WebPlayer from "../components/WebPlayer";
import { loadingAtom } from "../recoil/loadingAtom";
import { topTracksAtom } from "../recoil/topTracksAtom";

const TopTracks = () => {
  const history = useHistory();
  const setLoading = useSetRecoilState(loadingAtom);
  const [currentTrack, setCurrentTrack] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [topTracksInfo, setTopTracksInfo] = useRecoilState(topTracksAtom);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      if (!topTracksInfo.tracks) {
        setLoading(true);
        const payload = {
          pip: "https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=30",
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
              let imgArr = [];
              res.data.items.forEach((item) => {
                imgArr.push({ id: item.id, url: item.album.images[0].url });
              });
              setTopTracksInfo({
                tracks: res.data.items,
                images: imgArr,
              });
              setCurrentTrack(res.data.items[0].id);
            }
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setCurrentTrack(topTracksInfo.tracks[0].id);
      }
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
    const payload = {
      pip: `https://api.spotify.com/v1/tracks/${trackId}?market=IN`,
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
          setCurrentTrack(trackId);
          if (res.data.preview_url) {
            setAudioUrl(res.data.preview_url);
          } else {
            handleNextPlay();
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleTrackChange = (trackId) => {
    setCurrentTrack(trackId);
  };

  const handlePrevPlay = () => {
    let index;
    topTracksInfo.tracks.forEach((item, ind) => {
      if (item.id === currentTrack) {
        index = ind;
      }
    });

    // console.log(index);

    if (index === 0) {
      setCurrentTrack(topTracksInfo.tracks[topTracksInfo.tracks.length - 1].id);
    } else {
      setCurrentTrack(topTracksInfo.tracks[index - 1].id);
    }
  };

  const handleNextPlay = () => {
    let index;
    topTracksInfo.tracks.forEach((item, ind) => {
      if (item.id === currentTrack) {
        index = ind;
      }
    });

    // console.log(index);

    if (index === topTracksInfo.tracks.length - 1) {
      setCurrentTrack(topTracksInfo.tracks[0].id);
    } else {
      setCurrentTrack(topTracksInfo.tracks[index + 1].id);
    }
  };

  const handleShufflePlay = () => {
    let total = topTracksInfo.tracks.length;
    let rnd = Math.floor(Math.random() * total);
    setCurrentTrack(topTracksInfo.tracks[rnd].id);
  };

  return (
    <div className="dashboard-container">
      {topTracksInfo.tracks && topTracksInfo.tracks.length > 0 && currentTrack && (
        <div className="dashboard">
          <div>
            <TrackList
              currentTrack={currentTrack}
              tracks={topTracksInfo.tracks}
              changeTrack={handleTrackChange}
            />
            <WebPlayer
              url={audioUrl}
              prevPlay={handlePrevPlay}
              nextPlay={handleNextPlay}
              shufflePlay={handleShufflePlay}
            />
          </div>
          <Carousel data={topTracksInfo.images} current={currentTrack} />
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

export default TopTracks;
