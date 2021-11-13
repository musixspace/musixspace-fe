import React from "react";
import { AiFillCaretRight, AiOutlinePause } from "react-icons/ai";
import { FaRegEdit } from "react-icons/fa";
import { FiSkipBack, FiSkipForward } from "react-icons/fi";
import { paddedNumbers } from "../../util/functions";

const TrackList = ({
  data,
  currentSong,
  songNumber,
  handlePause,
  handleSetAndPlayTrack,
  onLeftClicked,
  onRightClicked,
  handleEdit,
}) => {
  return (
    <div className="topTracks">
      <div className="upper-container">
        <div className="title">Top Tracks</div>
        {/* <span onClick={handleEdit}>
          <FaRegEdit />
        </span> */}
      </div>
      <div className="songs-container">
        <button
          className="prev"
          onClick={() =>
            onLeftClicked(".topTracks > .songs-container > .tracks-container")
          }
        >
          <FiSkipBack />
        </button>
        <div className="tracks-container">
          {data &&
            data.map((item, idx) => (
              <div key={item.song_id} id={item.song_id} className="track">
                <div
                  className={`image-container ${
                    item.song_id === currentSong.songId ? "selected" : ""
                  }`}
                >
                  <img src={item.image_url} alt={item.name} />
                </div>
                <div className="content-container">
                  <div className="title">{item.name}</div>
                  <div className="sub">
                    {item.artists.map((i) => i.name).join(", ")}
                  </div>
                </div>
                {item.preview_url && (
                  <button
                    className="controls"
                    onClick={() =>
                      item.song_id === currentSong.songId
                        ? handlePause()
                        : handleSetAndPlayTrack(
                            idx + 1,
                            item.song_id,
                            item.preview_url
                          )
                    }
                  >
                    {item.song_id === currentSong.songId ? (
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
            onRightClicked(".topTracks > .songs-container > .tracks-container")
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
                songNumber > parseInt(data.length / 3) &&
                songNumber <= parseInt((2 * data.length) / 3)
                  ? "highlight"
                  : ""
              }`}
            ></div>
            <div
              className={`dot ${
                songNumber > parseInt((2 * data.length) / 3) &&
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

export default TrackList;
