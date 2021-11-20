import React, { useEffect } from "react";
import { paddedNumbers } from "../util/functions";
import Skeleton from "./Skeleton";

const TrackList = ({ currentTrack, tracks, changeTrack }) => {
  useEffect(() => {
    if (currentTrack && tracks.length > 0) {
      const container = document.querySelector(".tracks-container");
      let children = container.children;
      let index = 0;
      if (children[0]) {
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
    }
  }, [currentTrack]);

  return (
    <div className="tracks-container">
      {!tracks
        ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
            <div key={item} className="track">
              <div className="track-sub">
                <Skeleton type="text" />
                <Skeleton type="text" />
              </div>
              <div className="track-number">
                <Skeleton type="text" />
              </div>
            </div>
          ))
        : tracks.length > 0 &&
          tracks.map((item, ind) => (
            <div
              key={item.song_id}
              onClick={() => changeTrack(item.song_id)}
              className={`track ${
                currentTrack === item.song_id ? "selected-track" : ""
              }`}
            >
              <div className="track-sub">
                <div className="track-name">{item.name}</div>
                <div className="track-artists">
                  {item.artists.map((artist) => artist.name).join(", ")}
                </div>
              </div>
              <div className="track-number">{`#${paddedNumbers(ind + 1)}`}</div>
            </div>
          ))}
    </div>
  );
};

export default TrackList;
