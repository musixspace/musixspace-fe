import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useRecoilState, useSetRecoilState } from "recoil";
import Carousel from "../components/Carousel";
import TrackList from "../components/TrackList";
import WebPlayer from "../components/WebPlayer";
import { loadingAtom } from "../recoil/loadingAtom";
import { surpriseTracksAtom } from "../recoil/surpriseTracksAtom";

const SurpriseMe = () => {
  const history = useHistory();
  const setLoading = useSetRecoilState(loadingAtom);
  const [surpriseTracksInfo, setSurpriseTracksInfo] =
    useRecoilState(surpriseTracksAtom);
  const [currentTrack, setCurrentTrack] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      if (!surpriseTracksInfo.tracks) {
        setLoading(true);
        const payload = {
          pip: "https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=5",
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
              const tracks = res.data.items.map((track) => track.id);

              const payload2 = {
                pip: `https://api.spotify.com/v1/recommendations?seed_tracks=${tracks.toString()}&limit=30`,
                spotify_id: localStorage.getItem("spotifyId"),
              };

              axios
                .post(
                  `${process.env.REACT_APP_BACKEND_URI}/spotifyget`,
                  payload2,
                  {
                    headers: {
                      //"Content-Type": "application/json",
                      jwt_token: localStorage.getItem("accessToken"),
                    },
                  }
                )
                .then((topTracks) => {
                  // res=res.output;
                  // res=res.data.data;
                  console.log(topTracks);
                  if (topTracks.status === 200) {
                    let imgArr = [];
                    topTracks.data.tracks.forEach((item) => {
                      imgArr.push({
                        id: item.id,
                        url: item.album.images[0].url,
                      });
                    });
                    setSurpriseTracksInfo({
                      tracks: topTracks.data.tracks,
                      images: imgArr,
                    });
                    setCurrentTrack(topTracks.data.tracks[0].id);
                  }
                })
                .catch((err) => {
                  console.log(err);
                })
                .finally(() => {
                  setLoading(false);
                });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        setCurrentTrack(surpriseTracksInfo.tracks[0].id);
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
    surpriseTracksInfo.tracks.forEach((item, ind) => {
      if (item.id === currentTrack) {
        index = ind;
      }
    });

    // console.log(index);

    if (index === 0) {
      setCurrentTrack(
        surpriseTracksInfo.tracks[surpriseTracksInfo.tracks.length - 1].id
      );
    } else {
      setCurrentTrack(surpriseTracksInfo.tracks[index - 1].id);
    }
  };

  const handleNextPlay = () => {
    let index;
    surpriseTracksInfo.tracks.forEach((item, ind) => {
      if (item.id === currentTrack) {
        index = ind;
      }
    });

    // console.log(index);

    if (index === surpriseTracksInfo.tracks.length - 1) {
      setCurrentTrack(surpriseTracksInfo.tracks[0].id);
    } else {
      setCurrentTrack(surpriseTracksInfo.tracks[index + 1].id);
    }
  };

  const handleShufflePlay = () => {
    let total = surpriseTracksInfo.tracks.length;
    let rnd = Math.floor(Math.random() * total);
    setCurrentTrack(surpriseTracksInfo.tracks[rnd].id);
  };

  return (
    <div className="dashboard-container">
      {surpriseTracksInfo.tracks &&
        surpriseTracksInfo.tracks.length > 0 &&
        currentTrack && (
          <div className="dashboard">
            <div>
              <TrackList
                currentTrack={currentTrack}
                tracks={surpriseTracksInfo.tracks}
                changeTrack={handleTrackChange}
              />
              <WebPlayer
                url={audioUrl}
                prevPlay={handlePrevPlay}
                nextPlay={handleNextPlay}
                shufflePlay={handleShufflePlay}
              />
            </div>
            <Carousel data={surpriseTracksInfo.images} current={currentTrack} />
            <div className="heading">
              <p>Surprise Tracks Radio</p>
            </div>
          </div>
        )}
    </div>
  );
};

export default SurpriseMe;
