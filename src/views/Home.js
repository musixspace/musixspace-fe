import React from "react";
import ImageSlider from "../components/ImageSlider";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <div className="wrapper" style={{ backgroundColor: "var(--bg-home)" }}>
      <Navbar />
      <div className="home">
        <div className="content">
          <p>Come, join the music revolution.</p>
          <p>
            Form cross border companionships with the shared taste in music.
          </p>
        </div>
        <ImageSlider page={1} />
      </div>
    </div>
  );
};

export default Home;
