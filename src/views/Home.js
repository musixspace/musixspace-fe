import React from "react";
import ImageSlider from "../components/ImageSlider";
import Navbar from "../components/Navbar";
import { FaSpotify } from "react-icons/fa";
import { loginUrl } from "../util/spotify";

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
          <a href={loginUrl}>
            <span>
              <FaSpotify />
            </span>
            <span>Login with Spotify</span>
          </a>
        </div>
        <ImageSlider page={1} />
      </div>
    </div>
  );
};

export default Home;
