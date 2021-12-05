import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { MdEdit, MdSave } from "react-icons/md";
import { useParams } from "react-router";
import { useRecoilState, useSetRecoilState } from "recoil";
import WebPlayer from "../../components/WebPlayer";
import { alertAtom } from "../../recoil/alertAtom";
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
  const setAlert = useSetRecoilState(alertAtom);
  const [user, setUserState] = useRecoilState(userState);

  const [data, setData] = useState({
    currentUser: null,
    playlists: null,
    tracks: null,
    artists: null,
  });

  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    currentUser: null,
    playlists: null,
    tracks: null,
    artists: null,
  });

  const [currentSong, setCurrentSong] = useState({
    songId: null,
    audioUrl: null,
    list: "topTracks",
    genre: [],
    trackNumber: 1,
    artistNumber: 1,
  });

  const [modal, setModal] = useState({
    open: false,
    data: null,
  });

  useEffect(() => {
    if (modal.open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [modal.open]);

  useEffect(async () => {
    if (handle && handle !== "myspace") {
      apiCall();
    }
  }, [handle]);

  const apiCall = async () => {
    let finalObj = {
      currentUser: null,
      tracks: null,
      artists: null,
      playlists: null,
    };
    await axiosInstance
      .get(`/myspace_view/${handle}`)
      .then((res) => {
        finalObj = {
          ...finalObj,
          playlists: res.data.myspace_mixtapes,
          tracks: res.data.myspace_toptracks,
          artists: res.data.myspace_topartists,
        };
      })
      .catch((err) => {
        console.log(err);
      });

    await axiosInstance
      .get(`/users/${handle}`)
      .then((res) => {
        if (res.status === 200) {
          finalObj = {
            ...finalObj,
            currentUser: { ...res.data },
          };
        }
      })
      .catch((err) => {
        console.log(err);
      });

    setData({
      ...data,
      ...finalObj,
    });
    setEditData({
      ...editData,
      ...finalObj,
    });
  };

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
        const ct = data.tracks.songs.find(
          (item) => item.song_id === currentSong.songId
        );
        const artist = ct.artists.map((ar) => ar.name).join(", ");
        setMediaSession(ct.name, artist, ct.image_url, null, handleNextPlay);
      } else if (currentSong.list === "topArtists") {
        const ct = data.artists.artists.find(
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

  const handlePlaySong = (
    songId,
    audioUrl,
    num,
    list = "topTracks",
    genre = []
  ) => {
    setCurrentSong({
      ...currentSong,
      songId,
      audioUrl,
      list,
      genre,
      [list === "topTracks" ? "trackNumber" : "artistNumber"]: num,
    });
  };

  const handlePlayArtist = (artist, num) => {
    handlePlaySong(
      artist.artist_id,
      artist.toptrack ? artist.toptrack.preview_url : null,
      num,
      "topArtists",
      artist.genres
    );
  };

  const handleNextPlay = () => {
    if (
      data.tracks &&
      data.tracks.songs &&
      data.tracks.songs.length &&
      currentSong.list === "topTracks"
    ) {
      const track = data.tracks.songs.find(
        (item) => item.song_id === currentSong.songId
      );
      const index = data.tracks.songs.indexOf(track);
      if (index + 1 !== data.tracks.songs.length) {
        handlePlaySong(
          data.tracks.songs[index + 1].song_id,
          data.tracks.songs[index + 1].preview_url,
          index + 2
        );
      } else {
        handlePlaySong(
          data.tracks.songs[0].song_id,
          data.tracks.songs[0].preview_url,
          1
        );
      }
    } else if (currentSong.list === "topArtists") {
      const artist = data.artists.artists.find(
        (item) => item.artist_id === currentSong.songId
      );
      const index = data.artists.artists.indexOf(artist);
      if (index + 1 !== data.artists.artists.length) {
        handlePlayArtist(data.artists.artists[index + 1], index + 2);
      } else {
        handlePlayArtist(data.artists.artists[0], 1);
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

  const handleSave = () => {
    console.log(editData);
    const songs = editData.tracks.songs
      .map((item) => (item ? item.song_id : null))
      .filter((item) => item !== null);
    const artists = editData.artists.artists
      .map((item) => (item ? item.artist_id : null))
      .filter((item) => item !== null);
    const playlists = editData.playlists.playlist_ids
      .map((item) => {
        if (item) {
          return {
            cover_image: item.cover_image || null,
            nickname: item.nickname,
            songs: item.songs.map((i) => i.song_id),
            playlist_id: item.playlist_id,
            visible: item.visible,
          };
        }
        return null;
      })
      .filter((item) => item !== null);
    const payload = {
      display_name: editData.currentUser.display_name,
      anthem: editData.currentUser.anthem.song_id,
      image_url: editData.currentUser.image_url || null,
      myspace_toptracks: {
        nickname: editData.tracks.nickname,
        songs: songs,
      },
      myspace_topartists: {
        nickname: editData.artists.nickname,
        artists: artists,
      },
      myspace_mixtapes: {
        nickname: editData.playlists.nickname,
        playlist_ids: playlists,
      },
    };

    setAlert({
      open: true,
      message: `Updating your space...`,
      type: "info",
    });
    setEditMode(false);
    setData({
      ...data,
      currentUser: null,
      playlists: null,
      tracks: null,
      artists: null,
    });
    axiosInstance
      .post(`/myspace_edit/${handle}`, payload)
      .then((res) => {
        if (payload.image_url !== user.image) {
          setUserState({ ...user, image: payload.image_url });
        }
        apiCall();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="mySpace">
      <Intro
        user={data.currentUser}
        currentSong={currentSong}
        edit={editMode}
        editData={editData}
        setEditData={setEditData}
        handlePause={handlePause}
        handlePlaySong={handlePlaySong}
      />
      <TrackList
        data={data && data.tracks}
        currentSong={currentSong}
        songNumber={currentSong.trackNumber}
        handlePause={handlePause}
        handleSetAndPlayTrack={handlePlaySong}
        onLeftClicked={onLeftClicked}
        onRightClicked={onRightClicked}
        edit={editMode}
        editData={editData}
        setEditData={setEditData}
      />
      <ArtistList
        data={data && data.artists}
        currentSong={currentSong}
        songNumber={currentSong.artistNumber}
        handlePause={handlePause}
        handleSetAndPlayArtist={handlePlayArtist}
        onLeftClicked={onLeftClicked}
        onRightClicked={onRightClicked}
        edit={editMode}
        editData={editData}
        setEditData={setEditData}
      />
      {data && data.playlists && (
        <Playlist
          data={data && data.playlists}
          onLeftClicked={onLeftClicked}
          onRightClicked={onRightClicked}
          openPlaylistModal={openPlaylistModal}
          edit={editMode}
          editData={editData}
          setEditData={setEditData}
        />
      )}
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
          <button onClick={handleSave}>
            <MdSave />
          </button>
        </div>
      )}
    </div>
  );
};

export default MySpace;
