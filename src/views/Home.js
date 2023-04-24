import React from "react";
import { FaSpotify } from "react-icons/fa";
import banner1 from "../assets/images/banner1.png";
import banner2 from "../assets/images/banner2.png";
import banner3 from "../assets/images/banner3.png";
import BetaImageSlider from "../components/BetaImageSlider";
import CustomHelmet from "../components/CustomHelmet";
import { loginUrl } from "../util/spotify";

const BetaLanding = () => {
  return (
    <>
      <CustomHelmet
        title="Home"
        description="Match your music taste with your friends, artists or even strangers"
        keywords="Home, Discover, Spaces, Community"
      />
      <div className="beta-landing">
        <div className="first-page">
          <div className="image-wrapper">
            <BetaImageSlider />
          </div>
          <div className="content-wrapper">
            <div className="title">Welcome to Musixspace.</div>
            <div className="sub">
              A place where your only identity is your taste in music. That's
              what defines you and that's how you connect. Build cross border
              relationships with a shared taste in music.
            </div>
            <div className="button-container">
              <a href={loginUrl} rel="noreferrer nofollow noopener">
                <span>
                  <FaSpotify />
                </span>
                <span>Login with Spotify</span>
              </a>
            </div>
          </div>
        </div>
        <div className="second-page">
          <div className="content-wrapper">
            <div className="title">Discover, Send a Song, Connect.</div>
            <div className="sub">
              We believe the way we form new connections needs a music update.
              At musixspace you get to meet people who have the same taste in
              music as you. Discover, send a song and form cross border
              relationships with a strong backing of a common taste in music.
            </div>
            <div className="button-container">
              <a href={loginUrl} rel="noreferrer nofollow noopener">
                <span>
                  <FaSpotify />
                </span>
                <span>Login with Spotify</span>
              </a>
            </div>
          </div>
          <div className="image-container">
            <img src={banner3} alt="Banner 1" />
          </div>
        </div>
        <div className="second-page third-page">
          <div className="content-wrapper">
            <div className="title">Spaces.</div>
            <div className="sub">
              Create your own customized music space at Musixspace and flaunt
              your unique taste in music, add new vibes, let people know you
              through the music you listen to. We strongly believe you are what
              you listen to.
            </div>
            <div className="button-container">
              <a href={loginUrl} rel="noreferrer nofollow noopener">
                <span>
                  <FaSpotify />
                </span>
                <span>Login with Spotify</span>
              </a>
            </div>
          </div>
          <div className="image-container">
            <img src={banner2} alt="Banner 2" />
          </div>
        </div>
        <div className="second-page fourth-page">
          <div className="content-wrapper">
            <div className="title">An exclusive music community.</div>
            <div className="sub">
              Early access to an exclusive music community over Discord to help
              us build product in the way you want. Access to channels to post
              feature requests, report bugs, meet other cool people in Beta,
              share your space, participate in weekly music prompts and much
              more fun!
            </div>
            <div className="button-container">
              <a href={loginUrl} rel="noreferrer nofollow noopener">
                <span>
                  <FaSpotify />
                </span>
                <span>Login with Spotify</span>
              </a>
            </div>
          </div>
          <div className="image-container">
            <img src={banner1} alt="Banner 2" />
          </div>
        </div>
      </div>
    </>
  );
};

export default BetaLanding;
