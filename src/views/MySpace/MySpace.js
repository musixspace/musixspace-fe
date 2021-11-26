import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { MdEdit, MdSave } from "react-icons/md";
import { useParams } from "react-router";
import { useRecoilState } from "recoil";
import WebPlayer from "../../components/WebPlayer";
import { userState } from "../../recoil/userAtom";
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

  const [data, setData] = useState({
    currentUser: null,
    publicPlaylists: null,
    topTracks: {
      tracks: null,
      images: null,
    },
    topArtists: {
      artists: null,
      images: null,
    },
  });

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
    if (modal.open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [modal.open]);

  useEffect(async () => {
    if (handle && handle !== "myspace") {
      let userObj = {};
      let finalObj = {
        currentUser: null,
        publicPlaylists: null,
        topTracks: null,
        topArtists: null,
      };

      if (!data.currentUser) {
        await axiosInstance
          .get(`/users/${handle}`)
          .then((res) => {
            if (res.status === 200) {
              if (
                handle === user.username ||
                handle === localStorage.getItem("handle")
              ) {
                userObj = {
                  ...userObj,
                  displayName: res.data?.display_name,
                  username: res.data?.username,
                  image: res.data.image_url,
                  traits: res.data.traits,
                  anthem: res.data.anthem,
                };
              }
              finalObj.currentUser = { ...res.data };
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }

      if (!data.publicPlaylists) {
        await axiosInstance
          .get(`/playlists/${handle}`)
          .then((res) => {
            if (res.status === 200) {
              if (res.data !== "No playlists!") {
                finalObj.publicPlaylists = res.data;
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }

      if (!data.topTracks.tracks) {
        await axiosInstance
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
                userObj = {
                  ...userObj,
                  topTracksLong: {
                    images: imgArr,
                    tracks: songs,
                  },
                };
              }
              finalObj.topTracks = {
                images: imgArr,
                tracks: songs,
              };
            }
          })
          .catch((err) => console.log(err));
      }

      if (!data.topArtists.artists) {
        await axiosInstance
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
                userObj = {
                  ...userObj,
                  topArtistsLong: {
                    artists: artists,
                    images: imgArr,
                  },
                };
              }
              finalObj.topArtists = {
                artists: artists,
                images: imgArr,
              };
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
      setUser({
        ...user,
        ...userObj,
      });
      setData({ ...data, ...finalObj });
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
        const ct = data.topTracks.tracks.find(
          (item) => item.song_id === currentSong.songId
        );
        const artist = ct.artists.map((ar) => ar.name).join(", ");
        setMediaSession(ct.name, artist, ct.image_url, null, handleNextPlay);
      } else if (currentSong.list === "topArtists") {
        const ct = data.topArtists.artists.find(
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
        data.currentUser &&
        data.currentUser.anthem &&
        currentSong.songId === data.currentUser.anthem.song_id
      ) {
        const artist = data.currentUser.anthem.artists
          .map((item) => item.name)
          .join(", ");
        setMediaSession(
          data.currentUser.anthem.name,
          artist,
          data.currentUser.anthem.image_url,
          null,
          null
        );
      }
    }
  }, [currentSong.audioUrl]);

  useEffect(() => {
    handlePause();
  }, [editMode]);

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
    if (
      data.topTracks &&
      data.topTracks.tracks &&
      currentSong.list === "topTracks"
    ) {
      const track = data.topTracks.tracks.find(
        (item) => item.song_id === currentSong.songId
      );
      const index = data.topTracks.tracks.indexOf(track);
      if (index + 1 !== data.topTracks.tracks.length) {
        setSongNumber({ ...songNumber, tracks: index + 2 });
        handlePlaySong(
          data.topTracks.tracks[index + 1].song_id,
          data.topTracks.tracks[index + 1].preview_url
        );
      } else {
        setSongNumber({ ...songNumber, tracks: 1 });
        handlePlaySong(
          data.topTracks.tracks[0].song_id,
          data.topTracks.tracks[0].preview_url
        );
      }
    } else if (currentSong.list === "topArtists") {
      const artist = data.topArtists.artists.find(
        (item) => item.artist_id === currentSong.songId
      );
      const index = data.topArtists.artists.indexOf(artist);
      if (index + 1 !== data.topArtists.artists.length) {
        setSongNumber({ ...songNumber, artists: index + 2 });
        handlePlayArtist(data.topArtists.artists[index + 1]);
      } else {
        setSongNumber({ ...songNumber, artists: 1 });
        handlePlayArtist(data.topArtists.artists[0]);
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

  const openPlaylistModal = (item) => {
    if (currentSong.audioUrl) {
      handlePause();
    }
    setModal({
      ...modal,
      open: true,
      data: item,
    });
  };

  return (
    <div className="mySpace">
      <Intro
        user={data.currentUser}
        currentSong={currentSong}
        edit={editMode}
        handlePause={handlePause}
        handlePlaySong={handlePlaySong}
      />
      <TrackList
        data={data && data.topTracks && data.topTracks.tracks}
        currentSong={currentSong}
        songNumber={songNumber.tracks}
        handlePause={handlePause}
        handleSetAndPlayTrack={handleSetAndPlayTrack}
        onLeftClicked={onLeftClicked}
        onRightClicked={onRightClicked}
        edit={editMode}
      />
      <ArtistList
        data={data && data.topArtists && data.topArtists.artists}
        currentSong={currentSong}
        songNumber={songNumber.artists}
        handlePause={handlePause}
        handleSetAndPlayArtist={handleSetAndPlayArtist}
        onLeftClicked={onLeftClicked}
        onRightClicked={onRightClicked}
        edit={editMode}
      />
      <Playlist
        data={data && data.publicPlaylists}
        onLeftClicked={onLeftClicked}
        onRightClicked={onRightClicked}
        openPlaylistModal={openPlaylistModal}
        edit={editMode}
      />
      {currentSong.audioUrl && (
        <WebPlayer
          url={currentSong.audioUrl}
          nextPlay={handleNextPlay}
          noControls={true}
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
      {!editMode && handle === localStorage.getItem("handle") && (
        <div className="floating-buttons">
          <button onClick={() => setEditMode(true)}>
            <MdEdit />
          </button>
        </div>
      )}
      {editMode && (
        <div className="floating-buttons">
          <button onClick={() => setEditMode(false)}>
            <IoMdClose />
          </button>
          <button onClick={() => {}}>
            <MdSave />
          </button>
        </div>
      )}
    </div>
  );
};

export default MySpace;
