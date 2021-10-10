import React from "react";

const Carousel = ({ data, currentTrack }) => {
  if (Object.keys(data).length > 0 && currentTrack)
    return (
      <div className="img-container">
        <img src={data[currentTrack]} alt="" />
      </div>
    );
  else return null;
};

export default Carousel;
