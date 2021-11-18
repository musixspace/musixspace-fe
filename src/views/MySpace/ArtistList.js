import React from "react";
import { AiFillCaretRight, AiOutlinePause } from "react-icons/ai";
import { FiSkipBack, FiSkipForward } from "react-icons/fi";
import logo from "../../assets/images/logo-black.png";
import { paddedNumbers } from "../../util/functions";

const ArtistList = ({
  data,
  currentSong,
  songNumber,
  onLeftClicked,
  onRightClicked,
  handlePause,
  handleSetAndPlayArtist,
}) => {
  return (
    <div className="topArtists">
      <div className="upper-container">
        <div className="title">Top Artists</div>
      </div>
      <div className="genres-container">
        {currentSong.genre &&
          currentSong.genre.length > 0 &&
          currentSong.genre.map((genre) => (
            <div key={genre} className="genre">
              {genre}
            </div>
          ))}
      </div>
      <div className="songs-container">
        <button
          className="prev"
          onClick={() =>
            onLeftClicked(".topArtists > .songs-container > .tracks-container")
          }
        >
          <FiSkipBack />
        </button>
        <div className="tracks-container">
          {data &&
            data.map((item, idx) => (
              <div key={idx} id={item.artist_id} className="track">
                <div
                  className={`image-container ${
                    item.artist_id === currentSong.songId ? "selected" : ""
                  }`}
                >
                  <img src={item.image_url || logo} alt={item.name} />
                </div>
                <div className="content-container">
                  <div className="title">{item.name}</div>
                </div>
                {item.toptrack && item.toptrack.preview_url && (
                  <button
                    className="controls"
                    onClick={() =>
                      item.artist_id === currentSong.songId
                        ? handlePause()
                        : handleSetAndPlayArtist(idx + 1, item)
                    }
                  >
                    {item.artist_id === currentSong.songId ? (
                      <AiOutlinePause />
                    ) : (
                      <AiFillCaretRight />
                    )}
                  </button>
                )}
              </div>
            ))}
        </div>
        <button
          className="next"
          onClick={() =>
            onRightClicked(".topArtists > .songs-container > .tracks-container")
          }
        >
          <FiSkipForward />
        </button>
      </div>
      {data && data.length > 0 && (
        <div className="metadata-container">
          <div className="dots-container">
            <div
              className={`dot ${
                songNumber <= parseInt(data.length / 3) ? "highlight" : ""
              }`}
            ></div>
            <div
              className={`dot ${
                songNumber > data.length / 3 &&
                songNumber <= parseInt(2 * data.length) / 3
                  ? "highlight"
                  : ""
              }`}
            ></div>
            <div
              className={`dot ${
                songNumber > parseInt(2 * data.length) / 3 &&
                songNumber <= data.length
                  ? "highlight"
                  : ""
              }`}
            ></div>
          </div>
          <div className="song-number">
            <span>{`${paddedNumbers(songNumber)}`}</span>
            <span>{`/${data && data.length}`}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistList;
