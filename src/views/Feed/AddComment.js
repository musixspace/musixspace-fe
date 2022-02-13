import React, { useEffect, useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import logo from "../../assets/images/logo-black.png";
import WebPlayer from "../../components/WebPlayer";
import useDebounceCallback from "../../hooks/useDebounce";
import { userState } from "../../recoil/userAtom";
import { alertAtom } from "../../recoil/alertAtom";
import { axiosInstance } from "../../util/axiosConfig";
import { getContrastYIQ, setMediaSession } from "../../util/functions";

const AddComment = ({ bgColor, closeModal, submitData }) => {
  const user = useRecoilValue(userState);
  const textColor = getContrastYIQ(bgColor);

  const setAlert = useSetRecoilState(alertAtom);

  const [comment, setComment] = useState("");
  const [songList, setSongList] = useState([]);
  const [song, setSong] = useState({
    id: null,
    name: "",
    image_url: null,
    artists: null,
    preview_url: null,
  });

  const [currentSong, setCurrentSong] = useState({
    audioUrl: null,
    songName: "",
    artists: "",
    imageUrl: null,
  });

  const searchSongAPICall = useDebounceCallback((value) => {
    axiosInstance
      .post("/search", { query: value, type: "track" })
      .then((res) => {
        console.log(res.data);
        setSongList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, 1000);

  useEffect(() => {
    if (!song.id && song.name) {
      searchSongAPICall(song.name);
    }
  }, [song.name]);

  useEffect(() => {
    if (currentSong.audioUrl) {
      setMediaSession(
        currentSong.songName,
        currentSong.artists,
        currentSong.imageUrl,
        null,
        null
      );
    }
  }, [currentSong.audioUrl]);

  const toggleSong = () => {
    if (currentSong.audioUrl) {
      stopSong();
    } else {
      setCurrentSong({
        audioUrl: song.preview_url,
        songName: song.name,
        imageUrl: song.image_url,
        artists: song.artists,
      });
    }
  };

  const stopSong = () => {
    setCurrentSong({
      audioUrl: null,
      songName: "",
      artists: "",
      imageUrl: null,
    });
  };

  const handleSubmit = () => {
    if (!comment) {
      setAlert({
        open: true,
        type: "error",
        message: "Please enter a valid comment!",
      });
      return;
    }

    const payload = {
      song_id: song.id,
      comment: comment,
    };

    submitData(payload);
  };

  return (
    <div
      className="new-comment"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <div className="new-comment-header">
        <p>Add A Comment</p>
        <button onClick={closeModal}>
          <IoMdClose style={{ color: textColor }} />
        </button>
      </div>
      <div className="new-comment-subheading">
        <Link to={`/${user.username}`} className="user-info">
          <div className="image-container">
            <img
              src={user.image || logo}
              alt={`${user.displayName}'s Profile`}
            />
          </div>
          <div className="user-meta">
            <p>{user.displayName}</p>
            <p>@{user.username}</p>
          </div>
        </Link>
        <div className="load-more">
          <button onClick={handleSubmit}>Post</button>
        </div>
      </div>
      <div className="new-comment-input">
        <textarea
          name="comment-input"
          id="comment-input"
          rows="6"
          placeholder="Write your comment..."
          style={{ color: textColor }}
          value={comment}
          onInput={(e) => setComment(e.target.value)}
        ></textarea>
      </div>
      <div className="new-comment-song">
        <p>Embed a Song</p>
        <div className="song-container">
          <input
            type="text"
            placeholder="Enter song name..."
            style={{ color: textColor }}
            value={song.name}
            onChange={(e) => {
              setSong({
                ...song,
                id: null,
                name: e.target.value,
              });
            }}
          />
        </div>
        {songList.length > 0 && (
          <ul className="anthem-options">
            {!song.id &&
              songList.map((item) => (
                <li
                  key={item.id}
                  onClick={() => {
                    setSong({
                      id: item.id,
                      name: item.name,
                      image_url: item.image_url,
                      artists: item.artists
                        .map((a) => a.name)
                        .slice(0, 3)
                        .join(", "),
                      preview_url: item.preview_url,
                    });
                    setSongList([]);
                  }}
                >
                  <div className="image-container">
                    <img src={item.image_url} alt={item.name} />
                  </div>
                  <span>{item.name}</span>
                </li>
              ))}
          </ul>
        )}
      </div>
      {song.id ? (
        <div className="new-comment-preview-song" onClick={toggleSong}>
          <div className="image-container">
            <img src={song.image_url || logo} alt={`${song.name}`} />
            {currentSong.audioUrl &&
            currentSong.audioUrl === song.preview_url ? (
              <FaPause />
            ) : (
              <FaPlay />
            )}
          </div>
          <div className="song-info">
            <p>{song.name}</p>
            <p>{song.artists}</p>
          </div>
        </div>
      ) : null}
      {currentSong.audioUrl && (
        <WebPlayer
          url={currentSong.audioUrl}
          nextPlay={stopSong}
          noControls={true}
        />
      )}
    </div>
  );
};

export default AddComment;
