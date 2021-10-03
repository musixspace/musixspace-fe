import React from "react";
import "./TrackList.css";

const numToString = (number) => {
  if (number < 10) return `0${number}`;
  return `${number}`;
};

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
          <div className="track-name">{item.name}</div>
          <div className="track-sub">
            <div className="track-artists">
              {item.artists.map((artist) => artist.name).join(", ")}
            </div>
            <div className="track-number">{`#${numToString(ind + 1)}`}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrackList;
