import React from "react";
import { AiFillCaretRight, AiOutlinePause } from "react-icons/ai";
import logo from "../../assets/images/logo-black.png";

const Intro = ({
  user,
  displayName,
  currentSong,
  handlePause,
  handlePlaySong,
}) => {
  return (
    <div className="intro">
      <div className="image-container">
        <img src={user.image || logo} alt={`${displayName}'s Image'`} />
      </div>
      <div className="content-container">
        <div className="main">
          <p>{user.displayName}</p>
          <div className="sub">
            <div className="traits-container">
              {user.traits &&
                user.traits.length > 0 &&
                user.traits.map((trait) => (
                  <div key={trait} className="trait">
                    {trait}
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="middle">
          <p>{user.username}</p>
          <div className="button-container">
            <button>Match</button>
          </div>
        </div>
        <div className="anthem-container">
          <div className="content">
            <div>{`${displayName}'s Anthem`}</div>
            <p>{user.anthem.name}</p>
            <p>{user.anthem.artists.map((item) => item.name).join(", ")}</p>
          </div>
          <div
            className={`image-container ${
              user.anthem.song_id === currentSong.songId ? "highlight" : ""
            }`}
          >
            <img src={user.anthem.image_url} alt={`${displayName}'s Anthem'`} />
            {user.anthem.preview_url && (
              <button
                onClick={() =>
                  user.anthem.song_id === currentSong.songId
                    ? handlePause()
                    : handlePlaySong(
                        user.anthem.song_id,
                        user.anthem.preview_url,
                        null
                      )
                }
              >
                {user.anthem.song_id === currentSong.songId ? (
                  <AiOutlinePause />
                ) : (
                  <AiFillCaretRight />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intro;
