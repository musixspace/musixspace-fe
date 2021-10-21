import React, { useEffect } from "react";

const TrackList = ({ currentTrack, tracks, changeTrack }) => {
  useEffect(() => {
    if (currentTrack) {
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
  }, [currentTrack]);

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
