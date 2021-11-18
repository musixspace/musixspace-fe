import React from "react";
import { AiFillCaretRight } from "react-icons/ai";
import { FiSkipBack, FiSkipForward } from "react-icons/fi";
import logo from "../../assets/images/logo-black.png";

const Playlist = ({
  data,
  onLeftClicked,
  onRightClicked,
  openPlaylistModal,
}) => {
  return (
    <div className="topTracks">
      <div className="upper-container">
        <div className="title">Mix Tapes</div>
      </div>
      <div className="songs-container playlist-container">
        <button
          className="prev"
          onClick={() =>
            onLeftClicked(
              ".topTracks > .playlist-container > .tracks-container"
            )
          }
        >
          <FiSkipBack />
        </button>
        <div className="tracks-container">
          {data &&
            data.map((item, idx) => (
              <div
                key={item.playlist_id}
                id={item.playlist_id}
                className="track"
              >
                <div className={`image-container`}>
                  <img src={item.cover_image || logo} alt={item.name} />
                </div>
                <div className="content-container">
                  <div className="title">{item.name}</div>
                </div>
                <button
                  className="controls"
                  onClick={() => openPlaylistModal(item)}
                >
                  <AiFillCaretRight />
                </button>
              </div>
            ))}
        </div>
        <button
          className="next"
          onClick={() =>
            onRightClicked(
              ".topTracks > .playlist-container > .tracks-container"
            )
          }
        >
          <FiSkipForward />
        </button>
      </div>
    </div>
  );
};

export default Playlist;
