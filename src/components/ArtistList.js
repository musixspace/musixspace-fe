import React, { useEffect } from "react";
import { paddedNumbers } from "../util/functions";

const ArtistList = ({ currentArtist, artists, changeArtist }) => {
  useEffect(() => {
    if (currentArtist) {
      const container = document.querySelector(".tracks-container");
      let children = container.children;
      let index = 0;
      while (!children[index].classList.contains("selected-track")) {
        index++;
      }
      // console.log(index);
      if (index) {
        children = container.querySelector(
          `.track:nth-child(${index + 1})`
        ).offsetTop;
        container.scrollTo({ top: children, behavior: "smooth" });
      } else {
        container.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [currentArtist]);

  return (
    <div className="tracks-container">
      {artists.map((item, ind) => (
        <div
          key={item.artist_id}
          onClick={() => changeArtist(item.artist_id)}
          className={`track ${
            currentArtist === item.artist_id ? "selected-track" : ""
          }`}
        >
          <div className="track-sub">
            <div className="track-name">{item.name}</div>
          </div>
          <div className="track-number">{`#${paddedNumbers(ind + 1)}`}</div>
        </div>
      ))}
    </div>
  );
};

export default ArtistList;
