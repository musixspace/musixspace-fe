import React from "react";
import { FaSpotify } from "react-icons/fa";
import ImageSlider from "../components/ImageSlider";
import { loginUrl } from "../util/spotify";

const Home = () => {
  return (
    <div className="home">
      <div className="content">
        <p>Come, join the music revolution.</p>
        <p>Form cross border companionships with a shared taste in music.</p>
        <a href={loginUrl}>
          <span>
            <FaSpotify />
          </span>
          <span>Login with Spotify</span>
        </a>
      </div>
      <ImageSlider page={1} />
    </div>
  );
};

export default Home;
