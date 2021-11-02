import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import Carousel from "../components/Carousel";
import TrackList from "../components/TrackList";
import WebPlayer from "../components/WebPlayer";
import useTopTracks from "../hooks/useTopTracks";
import { surpriseTracksAtom } from "../recoil/surpriseTracksAtom";

const SurpriseMe = () => {
  const surpriseTracksInfo = useRecoilValue(surpriseTracksAtom);
  const { getRecommendations } = useTopTracks();
  const [currentTrack, setCurrentTrack] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

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
