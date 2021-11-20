import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import Carousel from "../components/Carousel";
import ExportPlaylistModal from "../components/ExportPlaylistModal";
import TrackList from "../components/TrackList";
import WebPlayer from "../components/WebPlayer";
import useTopTracks from "../hooks/useTopTracks";
import { alertAtom } from "../recoil/alertAtom";
import { userState } from "../recoil/userAtom";
import { axiosInstance } from "../util/axiosConfig";
import { setMediaSession } from "../util/functions";
import logo from "../assets/images/logo-black.png";

const SurpriseMe = () => {
  const user = useRecoilValue(userState);
  const { getRecommendations } = useTopTracks();
  const setAlert = useSetRecoilState(alertAtom);

  const [currentTrack, setCurrentTrack] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (!user.surpriseTracks.tracks) {
      getRecommendations(user.username || localStorage.getItem("handle"));
    } else {
      setCurrentTrack(user.surpriseTracks.tracks[0].song_id);
    }
  }, [user.surpriseTracks]);

  useEffect(() => {
    if (currentTrack) {
      changeTrack(currentTrack);
    }
  }, [currentTrack]);

  useEffect(() => {
    if (audioUrl) {
      const ct = user.surpriseTracks.tracks.find(
        (item) => item.song_id === currentTrack
      );
      const artist = ct.artists.map((item) => item.name).join(", ");
      setMediaSession(
        ct.name,
        artist,
        ct.image_url || logo,
        handlePrevPlay,
        handleNextPlay
      );
    }
  }, [audioUrl]);

  const changeTrack = (trackId) => {
    const newSong = user.surpriseTracks.tracks.find(
      (song) => song.song_id === trackId
    );
    if (newSong.preview_url) {
      setAudioUrl(newSong.preview_url);
    } else {
      handleNextPlay();
    }
  };

  const handleTrackChange = (trackId) => {
    setCurrentTrack(trackId);
  };

  const handlePrevPlay = () => {
    let index;
    user.surpriseTracks.tracks.forEach((item, ind) => {
      if (item.song_id === currentTrack) {
        index = ind;
      }
    });

    // console.log(index);

    if (index === 0) {
      setCurrentTrack(
        user.surpriseTracks.tracks[user.surpriseTracks.tracks.length - 1]
          .song_id
      );
    } else {
      setCurrentTrack(user.surpriseTracks.tracks[index - 1].song_id);
    }
  };

  const handleNextPlay = () => {
    let index;
    user.surpriseTracks.tracks.forEach((item, ind) => {
      if (item.song_id === currentTrack) {
        index = ind;
      }
    });

    // console.log(index);

    if (index === user.surpriseTracks.tracks.length - 1) {
      setCurrentTrack(user.surpriseTracks.tracks[0].song_id);
    } else {
      setCurrentTrack(user.surpriseTracks.tracks[index + 1].song_id);
    }
  };

  const handleShufflePlay = () => {
    let total = user.surpriseTracks.tracks.length;
    let rnd = Math.floor(Math.random() * total);
    setCurrentTrack(user.surpriseTracks.tracks[rnd].song_id);
  };

  const handleExport = (name) => {
    setOpenModal(false);
    // console.log(name);
    axiosInstance
      .post("/create_playlist", { query: "surprise_me", playlist_name: name })
      .then((res) => {
        if (res.status === 200) {
          setAlert({
            open: true,
            message: `${name} created successfully!`,
            type: "success",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard">
        <div>
          <TrackList
            currentTrack={currentTrack}
            tracks={user && user.surpriseTracks && user.surpriseTracks.tracks}
            changeTrack={handleTrackChange}
          />
          <WebPlayer
            url={audioUrl}
            prevPlay={handlePrevPlay}
            nextPlay={handleNextPlay}
            shufflePlay={handleShufflePlay}
          />
        </div>
        <Carousel
          data={user && user.surpriseTracks && user.surpriseTracks.images}
          current={currentTrack}
        />
        <div className="heading">
          <p>Surprise Tracks Radio</p>
          <div>
            <button id="export" onClick={(e) => setOpenModal(true)}>
              Export
            </button>
          </div>
        </div>
      </div>
      {openModal && (
        <ExportPlaylistModal
          submitData={handleExport}
          close={() => setOpenModal(false)}
        />
      )}
    </div>
  );
};

export default SurpriseMe;
