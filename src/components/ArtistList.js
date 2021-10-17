import React from "react";

const ArtistList = ({ currentArtist, artists, changeArtist }) => {
  return (
    <div className="tracks-container">
      {artists.map((item, ind) => (
        <div
          key={item.id}
          onClick={() => changeArtist(item.id)}
          className={`track ${
            currentArtist === item.id ? "selected-track" : ""
          }`}
        >
          <div className="track-sub">
            <div className="track-name">{item.name}</div>
          </div>
          <div className="track-number">{`#${ind + 1}`}</div>
        </div>
      ))}
    </div>
  );
};

export default ArtistList;
