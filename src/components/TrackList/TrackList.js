import React from "react";
import "./TrackList.css";

const TrackList = ({ currentTrack, tracks, changeTrack }) => {
  return (
    <div className="tracks-container">
      {tracks.map((item, ind) => (
        <div
          key={item.id}
          onClick={() => changeTrack(item.id)}
          className={`track ${
            currentTrack === item.id ? "selected-track" : ""
          }`}
        >
          <div className="track-sub">
            <div className="track-name">{item.name}</div>
            <div className="track-artists">
              {item.artists.map((artist) => artist.name).join(", ")}
            </div>
          </div>
          <div className="track-number">{`#${ind + 1}`}</div>
        </div>
      ))}
    </div>
  );
};

export default TrackList;
