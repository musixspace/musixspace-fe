import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useRecoilState, useSetRecoilState } from "recoil";
import Carousel from "../components/Carousel";
import TrackList from "../components/TrackList";
import WebPlayer from "../components/WebPlayer";
import { loadingAtom } from "../recoil/loadingAtom";
import { topTracksAtom } from "../recoil/topTracksAtom";
import { axiosInstance } from "../util/axiosConfig";

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

        axiosInstance
          .post("/toptracks_long")
          .then((res) => {
            if (res.status === 200) {
              const songs = res.data.songs;
              let imgArr = [];
              songs.forEach((item) => {
                imgArr.push({ id: item.song_id, url: item.image_url });
              });
              setTopTracksInfo({
                tracks: songs,
                images: imgArr,
              });
              setCurrentTrack(songs[0].song_id);
              setLoading(false);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        setCurrentTrack(topTracksInfo.tracks[0].song_id);
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
    const newSong = topTracksInfo.tracks.filter(
      (item) => item.song_id === trackId
    );

    if (newSong[0].preview_url) {
      setAudioUrl(newSong[0].preview_url);
    } else {
      handleNextPlay();
    }

    // axios
    //   .post(`${process.env.REACT_APP_BACKEND_URI}/spotifyget`, payload, {
    //     headers: {
    //       //"Content-Type": "application/json",
    //       jwt_token: localStorage.getItem("accessToken"),
    //     },
    //   })
    //   .then((res) => {
    //     if (res.status === 200) {
    //       setCurrentTrack(trackId);
    //       if (res.data.preview_url) {
    //         setAudioUrl(res.data.preview_url);
    //       } else {
    //         handleNextPlay();
    //       }
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };

  const handleTrackChange = (trackId) => {
    setCurrentTrack(trackId);
  };

  const handlePrevPlay = () => {
    let index;
    topTracksInfo.tracks.forEach((item, ind) => {
      if (item.song_id === currentTrack) {
        index = ind;
      }
    });

    // console.log(index);

    if (index === 0) {
      setCurrentTrack(
        topTracksInfo.tracks[topTracksInfo.tracks.length - 1].song_id
      );
    } else {
      setCurrentTrack(topTracksInfo.tracks[index - 1].song_id);
    }
  };

  const handleNextPlay = () => {
    let index;
    topTracksInfo.tracks.forEach((item, ind) => {
      if (item.song_id === currentTrack) {
        index = ind;
      }
    });

    // console.log(index);

    if (index === topTracksInfo.tracks.length - 1) {
      setCurrentTrack(topTracksInfo.tracks[0].song_id);
    } else {
      setCurrentTrack(topTracksInfo.tracks[index + 1].song_id);
    }
  };

  const handleShufflePlay = () => {
    let total = topTracksInfo.tracks.length;
    let rnd = Math.floor(Math.random() * total);
    setCurrentTrack(topTracksInfo.tracks[rnd].song_id);
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
