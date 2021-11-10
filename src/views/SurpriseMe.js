import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import Carousel from "../components/Carousel";
import ExportPlaylistModal from "../components/ExportPlaylistModal";
import TrackList from "../components/TrackList";
import WebPlayer from "../components/WebPlayer";
import useTopTracks from "../hooks/useTopTracks";
import { alertAtom } from "../recoil/alertAtom";
import { surpriseTracksAtom } from "../recoil/surpriseTracksAtom";
import { axiosInstance } from "../util/axiosConfig";
import { setMediaSession } from "../util/functions";

const SurpriseMe = () => {
  const surpriseTracksInfo = useRecoilValue(surpriseTracksAtom);
  const setAlert = useSetRecoilState(alertAtom);
  const { getRecommendations } = useTopTracks();
  const [currentTrack, setCurrentTrack] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (!surpriseTracksInfo.tracks) {
      getRecommendations();
    } else {
      setCurrentTrack(surpriseTracksInfo.tracks[0].song_id);
    }
  }, [surpriseTracksInfo]);

  useEffect(() => {
    if (currentTrack) {
      changeTrack(currentTrack);
    }
  }, [currentTrack]);

  useEffect(() => {
    if (audioUrl) {
      const ct = surpriseTracksInfo.tracks.find(
        (item) => item.song_id === currentTrack
      );
      const artist = ct.artists.map((item) => item.name).join(", ");
      setMediaSession(
        ct.name,
        artist,
        ct.image_url,
        handlePrevPlay,
        handleNextPlay
      );
    }
  }, [audioUrl]);

  const changeTrack = (trackId) => {
    const newSong = surpriseTracksInfo.tracks.find(
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
              <div>
                <button id="export" onClick={(e) => setOpenModal(true)}>
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

export default SurpriseMe;
