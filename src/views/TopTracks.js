import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import Carousel from "../components/Carousel";
import ExportPlaylistModal from "../components/ExportPlaylistModal";
import TrackList from "../components/TrackList";
import WebPlayer from "../components/WebPlayer";
import useTopTracks from "../hooks/useTopTracks";
import { axiosInstance } from "../util/axiosConfig";
import { setMediaSession } from "../util/functions";
import { alertAtom } from "../recoil/alertAtom";
import { userState } from "../recoil/userAtom";
import logo from "../assets/images/logo-black.png";

const TopTracks = () => {
  const user = useRecoilValue(userState);
  const { getTopTracksLong } = useTopTracks();
  const setAlert = useSetRecoilState(alertAtom);
  const [currentTrack, setCurrentTrack] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    console.log(user);
    if (!user.topTracksLong.tracks) {
      getTopTracksLong(user.username || localStorage.getItem("handle"));
    } else {
      setCurrentTrack(user.topTracksLong.tracks[0].song_id);
    }
  }, [user.topTracksLong.tracks]);

  useEffect(() => {
    if (currentTrack) {
      changeTrack(currentTrack);
    }
  }, [currentTrack]);

  useEffect(() => {
    if (audioUrl) {
      const ct = user.topTracksLong.tracks.find(
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
    const newSong = user.topTracksLong.tracks.find(
      (item) => item.song_id === trackId
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
    user.topTracksLong.tracks.forEach((item, ind) => {
      if (item.song_id === currentTrack) {
        index = ind;
      }
    });

    // console.log(index);

    if (index === 0) {
      setCurrentTrack(
        user.topTracksLong.tracks[user.topTracksLong.tracks.length - 1].song_id
      );
    } else {
      setCurrentTrack(user.topTracksLong.tracks[index - 1].song_id);
    }
  };

  const handleNextPlay = () => {
    let index;
    user.topTracksLong.tracks.forEach((item, ind) => {
      if (item.song_id === currentTrack) {
        index = ind;
      }
    });

    // console.log(index);

    if (index === user.topTracksLong.tracks.length - 1) {
      setCurrentTrack(user.topTracksLong.tracks[0].song_id);
    } else {
      setCurrentTrack(user.topTracksLong.tracks[index + 1].song_id);
    }
  };

  const handleExport = (name) => {
    setOpenModal(false);
    // console.log(name);
    axiosInstance
      .post("/create_playlist", { query: "top_tracks", playlist_name: name })
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

  const handleShufflePlay = () => {
    let total = user.topTracksLong.tracks.length;
    let rnd = Math.floor(Math.random() * total);
    setCurrentTrack(user.topTracksLong.tracks[rnd].song_id);
  };

  return (
    <div className="dashboard-container">
      {user.topTracksLong.tracks &&
        user.topTracksLong.tracks.length > 0 &&
        currentTrack && (
          <div className="dashboard">
            <div>
              <TrackList
                currentTrack={currentTrack}
                tracks={user.topTracksLong.tracks}
                changeTrack={handleTrackChange}
              />
              <WebPlayer
                url={audioUrl}
                prevPlay={handlePrevPlay}
                nextPlay={handleNextPlay}
                shufflePlay={handleShufflePlay}
              />
            </div>
            <Carousel data={user.topTracksLong.images} current={currentTrack} />
            <div className="heading">
              <p>Your Top Tracks Radio</p>
              <div>
                <p>30 sec</p>
                <button id="export" onClick={() => setOpenModal(true)}>
                  Export
                </button>
              </div>
            </div>
          </div>
        )}
      {openModal && (
        <ExportPlaylistModal
          submitData={handleExport}
          close={() => setOpenModal(false)}
        />
      )}
    </div>
  );
};

export default TopTracks;
