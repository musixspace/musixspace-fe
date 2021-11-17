import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import WebPlayer from "../../components/WebPlayer";
import useProfile from "../../hooks/useProfile";
import { loadingAtom } from "../../recoil/loadingAtom";
import { userNameSelector, userState } from "../../recoil/userAtom";
import { axiosInstance } from "../../util/axiosConfig";
import { setMediaSession } from "../../util/functions";
import ArtistList from "./ArtistList";
import Intro from "./Intro";
import Playlist from "./Playlist";
import PlaylistModal from "./PlaylistModal";
import TrackList from "./TrackList";

const MySpace = () => {
  const { handle } = useParams();
  const [user, setUser] = useRecoilState(userState);
  const displayName = useRecoilValue(userNameSelector);
  const setLoading = useSetRecoilState(loadingAtom);

  const { getUserProfile } = useProfile();

  const [topTracks, setTopTracks] = useState({
    tracks: null,
    images: null,
  });
  const [topArtists, setTopArtists] = useState({
    artists: null,
    images: null,
  });
  const [publicPlaylists, setPublicPlaylists] = useState(null);
  const [currentSong, setCurrentSong] = useState({
    songId: null,
    audioUrl: null,
    list: "topTracks",
    genre: [],
  });

  const [songNumber, setSongNumber] = useState({
    tracks: 1,
    artists: 1,
  });

  const [modal, setModal] = useState({
    open: false,
    data: null,
  });

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (!user.displayName) {
      getUserProfile();
    }
  }, [user.displayName]);

  useEffect(() => {
    if (handle && handle !== "myspace") {
      setLoading(true);
      if (!publicPlaylists) {
        axiosInstance
          .get(`/playlists/${handle}`)
          .then((res) => {
            if (res.status === 200) {
              if (res.data !== "No playlists!") {
                console.log(res.data);
                setPublicPlaylists(res.data);
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }

      if (!topTracks.tracks) {
        axiosInstance
          .get(`toptracks_long/${handle}`)
          .then((res) => {
            if (res.status === 200) {
              const songs = res.data.songs;
              let imgArr = [];
              songs.forEach((item) => {
                imgArr.push({ id: item.song_id, url: item.image_url });
              });
              if (
                handle === user.username ||
                handle === localStorage.getItem("handle")
              ) {
                setUser({
                  ...user,
                  topTracksLong: {
                    images: imgArr,
                    tracks: songs,
                  },
                });
              }
              setTopTracks({
                images: imgArr,
                tracks: songs,
              });
            }
          })
          .catch((err) => console.log(err));
      }

      if (!topArtists.artists) {
        axiosInstance
          .get(`/topartists_long/${handle}`)
          .then((res) => {
            if (res.status === 200) {
              const artists = res.data.artists;
              let imgArr = [];
              artists.forEach((artist) => {
                imgArr.push({
                  id: artist.artist_id,
                  url:
                    artist.image_url ||
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRd-y-IJN8glQlf1qoU01dEgGPUa0d1-sjfWg&usqp=CAU",
                });
              });
              if (
                handle === user.username ||
                handle === localStorage.getItem("handle")
              ) {
                setUser({
                  ...user,
                  topArtistsLong: {
                    artists: artists,
                    images: imgArr,
                  },
                });
              }
              setTopArtists({
                artists: artists,
                images: imgArr,
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }

      setLoading(false);
    }
  }, [handle]);

  useEffect(() => {
    if (currentSong.songId && currentSong.list) {
      let container;
      if (currentSong.list === "topTracks") {
        container = document.querySelector(
          ".topTracks > .songs-container > .tracks-container"
        );
      } else {
        container = document.querySelector(
          ".topArtists > .songs-container > .tracks-container"
        );
      }
      let children = container.children;
      let index = 0;
      while (children[index].id !== currentSong.songId) {
        index++;
      }
      if (index) {
        const leftOffset = container.querySelector(
          `.track:nth-child(${index + 1})`
        ).offsetLeft;
        const widthOfElement = container.querySelector(
          `.track:nth-child(${index + 1})`
        ).offsetWidth;
        container.scrollTo({
          left: leftOffset - widthOfElement / 1.5,
          behavior: "smooth",
        });
      } else {
        container.scrollTo({ left: 0, behavior: "smooth" });
      }
    }
  }, [currentSong.songId]);

  useEffect(() => {
    if (currentSong.audioUrl) {
      if (currentSong.list === "topTracks") {
        const ct = topTracks.tracks.find(
          (item) => item.song_id === currentSong.songId
        );
        const artist = ct.artists.map((ar) => ar.name).join(", ");
        setMediaSession(ct.name, artist, ct.image_url, null, handleNextPlay);
      } else if (currentSong.list === "topArtists") {
        const ct = topArtists.artists.find(
          (item) => item.artist_id === currentSong.songId
        );
        setMediaSession(
          ct.toptrack.name,
          ct.name,
          ct.image_url,
          null,
          handleNextPlay
        );
      } else if (
        currentSong.list === null &&
        user &&
        user.anthem &&
        currentSong.songId === user.anthem.song_id
      ) {
        const artist = user.anthem.artists.map((item) => item.name).join(", ");
        setMediaSession(
          user.anthem.name,
          artist,
          user.anthem.image_url,
          null,
          null
        );
      }
    }
  }, [currentSong.audioUrl]);

  const onLeftClicked = (selector) => {
    document.querySelector(selector).scrollBy(-1000, 0);
  };

  const onRightClicked = (selector) => {
    document.querySelector(selector).scrollBy(1000, 0);
  };

  const handleSetAndPlayArtist = (num, item) => {
    setSongNumber({ ...songNumber, artists: num });
    handlePlayArtist(item);
  };

  const handleSetAndPlayTrack = (num, songId, audioUrl) => {
    setSongNumber({ ...songNumber, tracks: num });
    handlePlaySong(songId, audioUrl);
  };

  const handlePlaySong = (songId, audioUrl, list = "topTracks", genre = []) => {
    setCurrentSong({
      ...currentSong,
      songId,
      audioUrl,
      list,
      genre,
    });
  };

  const handlePlayArtist = (artist) => {
    handlePlaySong(
      artist.artist_id,
      artist.toptrack ? artist.toptrack.preview_url : null,
      "topArtists",
      artist.genres
    );
  };

  const handleNextPlay = () => {
    if (topTracks && topTracks.tracks && currentSong.list === "topTracks") {
      const track = topTracks.tracks.find(
        (item) => item.song_id === currentSong.songId
      );
      const index = topTracks.tracks.indexOf(track);
      if (index + 1 !== topTracks.tracks.length) {
        setSongNumber({ ...songNumber, tracks: index + 2 });
        handlePlaySong(
          topTracks.tracks[index + 1].song_id,
          topTracks.tracks[index + 1].preview_url
        );
      } else {
        setSongNumber({ ...songNumber, tracks: 1 });
        handlePlaySong(
          topTracks.tracks[0].song_id,
          topTracks.tracks[0].preview_url
        );
      }
    } else if (currentSong.list === "topArtists") {
      const artist = topArtists.artists.find(
        (item) => item.artist_id === currentSong.songId
      );
      const index = topArtists.artists.indexOf(artist);
      if (index + 1 !== topArtists.artists.length) {
        setSongNumber({ ...songNumber, artists: index + 2 });
        handlePlayArtist(topArtists.artists[index + 1]);
      } else {
        setSongNumber({ ...songNumber, artists: 1 });
        handlePlayArtist(topArtists.artists[0]);
      }
    } else {
      setCurrentSong({ ...currentSong, songId: null, audioUrl: null });
    }
  };

  const handlePause = () => {
    setCurrentSong({
      ...currentSong,
      songId: null,
      audioUrl: null,
      list: null,
    });
  };

  const handleEditClick = () => {
    if (editMode) {
      setEditMode(false);
    } else {
      setEditMode(true);
    }
  };

  const openPlaylistModal = (item) => {
    setModal({
      ...modal,
      open: true,
      data: item,
    });
  };

  return (
    <div className="mySpace">
      {user.displayName && (
        <Intro
          user={user}
          currentSong={currentSong}
          displayName={displayName}
          handlePause={handlePause}
          handlePlaySong={handlePlaySong}
        />
      )}
      {topTracks.tracks && topTracks.tracks.length > 0 && (
        <TrackList
          data={topTracks.tracks}
          currentSong={currentSong}
          songNumber={songNumber.tracks}
          handlePause={handlePause}
          handleSetAndPlayTrack={handleSetAndPlayTrack}
          onLeftClicked={onLeftClicked}
          onRightClicked={onRightClicked}
        />
      )}
      {topArtists.artists && topArtists.artists.length > 0 && (
        <ArtistList
          data={topArtists.artists}
          currentSong={currentSong}
          songNumber={songNumber.artists}
          handlePause={handlePause}
          handleSetAndPlayArtist={handleSetAndPlayArtist}
          onLeftClicked={onLeftClicked}
          onRightClicked={onRightClicked}
        />
      )}
      {currentSong.audioUrl && (
        <WebPlayer
          url={currentSong.audioUrl}
          nextPlay={handleNextPlay}
          noControls={true}
        />
      )}
      {publicPlaylists && publicPlaylists.length > 0 && (
        <Playlist
          data={publicPlaylists}
          onLeftClicked={onLeftClicked}
          onRightClicked={onRightClicked}
          openPlaylistModal={openPlaylistModal}
        />
      )}
      {currentSong.songId && !currentSong.audioUrl && handleNextPlay()}
      {modal.open && (
        <PlaylistModal
          data={modal.data}
          close={() => setModal({ ...modal, data: null, open: false })}
          isEdit={false}
        />
      )}
    </div>
  );
};

export default MySpace;
