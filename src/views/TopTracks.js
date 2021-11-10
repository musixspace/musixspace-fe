import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import Carousel from "../components/Carousel";
import ExportPlaylistModal from "../components/ExportPlaylistModal";
import TrackList from "../components/TrackList";
import WebPlayer from "../components/WebPlayer";
import useTopTracks from "../hooks/useTopTracks";
import { topTracksLongAtom } from "../recoil/topTracksAtom";
import { setMediaSession } from "../util/functions";

const TopTracks = () => {
  const { getTopTracksLong } = useTopTracks();
  const [currentTrack, setCurrentTrack] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const topTracksLong = useRecoilValue(topTracksLongAtom);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (!topTracksLong.tracks) {
      getTopTracksLong();
    } else {
      setCurrentTrack(topTracksLong.tracks[0].song_id);
    }
  }, [topTracksLong]);

  useEffect(() => {
    if (currentTrack) {
      changeTrack(currentTrack);
    }
  }, [currentTrack]);

  useEffect(() => {
    if (audioUrl) {
      const ct = topTracksLong.tracks.find(
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
    const newSong = topTracksLong.tracks.filter(
      (item) => item.song_id === trackId
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
    topTracksLong.tracks.forEach((item, ind) => {
      if (item.song_id === currentTrack) {
        index = ind;
      }
    });

    // console.log(index);

    if (index === 0) {
      setCurrentTrack(
        topTracksLong.tracks[topTracksLong.tracks.length - 1].song_id
      );
    } else {
      setCurrentTrack(topTracksLong.tracks[index - 1].song_id);
    }
  };

  const handleNextPlay = () => {
    let index;
    topTracksLong.tracks.forEach((item, ind) => {
      if (item.song_id === currentTrack) {
        index = ind;
      }
    });

    // console.log(index);

    if (index === topTracksLong.tracks.length - 1) {
      setCurrentTrack(topTracksLong.tracks[0].song_id);
    } else {
      setCurrentTrack(topTracksLong.tracks[index + 1].song_id);
    }
  };

  const handleExport = (name) => {
    setOpenModal(false);
    console.log(name);
    // axiosInstance
    //   .post("/create_playlist", { query: "top_tracks" })
    //   .then((res) => {
    //     console.log(res);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };

  const handleShufflePlay = () => {
    let total = topTracksLong.tracks.length;
    let rnd = Math.floor(Math.random() * total);
    setCurrentTrack(topTracksLong.tracks[rnd].song_id);
  };

  return (
    <div className="dashboard-container">
      {topTracksLong.tracks && topTracksLong.tracks.length > 0 && currentTrack && (
        <div className="dashboard">
          <div>
            <TrackList
              currentTrack={currentTrack}
              tracks={topTracksLong.tracks}
              changeTrack={handleTrackChange}
            />
            <WebPlayer
              url={audioUrl}
              prevPlay={handlePrevPlay}
              nextPlay={handleNextPlay}
              shufflePlay={handleShufflePlay}
            />
          </div>
          <Carousel data={topTracksLong.images} current={currentTrack} />
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
