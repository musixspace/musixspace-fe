import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useRecoilState, useSetRecoilState } from "recoil";
import Carousel from "../components/Carousel";
import TrackList from "../components/TrackList";
import WebPlayer from "../components/WebPlayer";
import { loadingAtom } from "../recoil/loadingAtom";
import { surpriseTracksAtom } from "../recoil/surpriseTracksAtom";
import { axiosInstance } from "../util/axiosConfig";

const SurpriseMe = () => {
  const history = useHistory();
  const setLoading = useSetRecoilState(loadingAtom);
  const [surpriseTracksInfo, setSurpriseTracksInfo] =
    useRecoilState(surpriseTracksAtom);
  const [currentTrack, setCurrentTrack] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

  useEffect(() => {
    console.log(surpriseTracksInfo, currentTrack, audioUrl);
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      if (!surpriseTracksInfo.tracks) {
        setLoading(true);

        axiosInstance
          .post("/recommendation")
          .then((res) => {
            const songs = res.data.songs;
            let imgArr = [];
            songs.forEach((song) => {
              imgArr.push({ id: song.song_id, url: song.image_url });
            });
            setSurpriseTracksInfo({
              tracks: songs,
              images: imgArr,
            });
            setCurrentTrack(songs[0].song_id);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        setCurrentTrack(surpriseTracksInfo.tracks[0].song_id);
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
    const newSong = surpriseTracksInfo.tracks.filter(
      (song) => song.song_id === trackId
    );
    if (newSong[0].preview_url) {
      setAudioUrl(newSong[0].preview_url);
    } else {
      handleNextPlay();
    }
  };

  const handleTrackChange = (trackId) => {
    setCurrentTrack(trackId);
  };

  const handlePrevPlay = () => {
    let index;
    surpriseTracksInfo.tracks.forEach((item, ind) => {
      if (item.song_id === currentTrack) {
        index = ind;
      }
    });

    // console.log(index);

    if (index === 0) {
      setCurrentTrack(
        surpriseTracksInfo.tracks[surpriseTracksInfo.tracks.length - 1].song_id
      );
    } else {
      setCurrentTrack(surpriseTracksInfo.tracks[index - 1].song_id);
    }
  };

  const handleNextPlay = () => {
    let index;
    surpriseTracksInfo.tracks.forEach((item, ind) => {
      if (item.song_id === currentTrack) {
        index = ind;
      }
    });

    // console.log(index);

    if (index === surpriseTracksInfo.tracks.length - 1) {
      setCurrentTrack(surpriseTracksInfo.tracks[0].song_id);
    } else {
      setCurrentTrack(surpriseTracksInfo.tracks[index + 1].song_id);
    }
  };

  const handleShufflePlay = () => {
    let total = surpriseTracksInfo.tracks.length;
    let rnd = Math.floor(Math.random() * total);
    setCurrentTrack(surpriseTracksInfo.tracks[rnd].song_id);
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
