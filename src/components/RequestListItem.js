import React, { useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa";

import logo from "../assets/images/logo-black.png";
import { useChat } from "../context/chatContext";
import { axiosInstance } from "../util/axiosConfig";
import WebPlayer from "./WebPlayer";

const RequestListItem = ({ request }) => {
  const [currentSong, setCurrentSong] = useState({
    audioUrl: null,
    songName: "",
    artists: "",
    imageUrl: null,
  });
  const { requests, setRequests } = useChat();

  const handleAccept = async (request_id) => {
    try {
      const resp = await axiosInstance.post("/chat/accept", { request_id });
      console.log(resp);
      const reqs = requests.filter((item) => item.request_id !== request_id);
      setRequests(reqs);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleSong = (item) => {
    if (currentSong.audioUrl && currentSong.audioUrl === item.preview_url) {
      stopSong();
    } else {
      setCurrentSong({
        audioUrl: item.preview_url,
        songName: item.name,
        imageUrl: item.image_url,
        artists: item.artists.map((item) => item.name).join(", "),
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

  return (
    <div className="rli-container">
      <div
        className="rli-song-wrapper"
        onClick={() => {
          toggleSong(request.content);
        }}
      >
        <div className="rli-song-image-container">
          <img
            src={request.content.image_url || logo}
            alt={request.content.name}
          />
          {currentSong.audioUrl &&
          currentSong.audioUrl === request.content.preview_url ? (
            <FaPause />
          ) : (
            <FaPlay />
          )}
        </div>
        <div className="rli-song-info-container">
          <p>{request.content.name}</p>
          <p>by {request.username}</p>
        </div>
      </div>
      <div className="rli-button-wrapper">
        <button
          onClick={() => {
            handleAccept(request.request_id);
          }}
          className="rli-button"
        >
          Accept
        </button>
      </div>
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

export default RequestListItem;
