import React from "react";
import { FiChevronDown } from "react-icons/fi";
import image1 from "../assets/images/artists/image1.png";
import image2 from "../assets/images/artists/image2.png";

const Match = () => {
  const scrollToPage = (str) => {
    document.querySelector(`.${str}`).scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="match-container">
      <div className="first-page">
        <div className="topbar">
          <div className="image-container">
            <img src={image1} alt="Dummy" />
            <img src={image2} alt="Dummy" />
          </div>
          <p className="name-container">Amaya x Sanya</p>
        </div>
        <div className="middle-content">
          <div className="text">
            <p>
              That’s a harmony we have never heard of before! Send a song to
              give a spark to this vibe.
            </p>
          </div>
          <div className="button-container">
            <button>Send a Song</button>
          </div>
        </div>
        <div className="percentage">
          <p>
            {"~"}68%{"~"}
          </p>
        </div>
        <div
          className="scroll-content"
          onClick={() => scrollToPage("second-page")}
        >
          <p>
            all it takes is a <span className="black">scroll up</span> to know
            what <span className="black">Amaya</span> and{" "}
            <span className="black">Sanya</span>
            <br />
            like to
            <span className="black"> listen</span> to and imagine the{" "}
            <span className="black">picturesque</span> of Amaya x Sanya.
          </p>
          <FiChevronDown />
        </div>
      </div>
      <div className="second-page">
        <div className="content-container">
          <div className="title">Top Artist</div>
          <div className="image-container">
            <img src={image1} alt="Dummy" />
          </div>
          <div className="name">John Mayer</div>
        </div>
        <div className="middle-content">
          <p>
            <span className="black">when it comes to these,</span>
            <br />
            Amaya and Sanya{" "}
            <span className="black">can’t hit the skip button!</span>
          </p>
        </div>
        <div className="content-container">
          <div className="title">Top Track</div>
          <div className="image-container">
            <img src={image2} alt="Dummy" />
          </div>
          <div className="name">Tum Jab Paas</div>
        </div>
        <div className="scroll-content">
          <p>
            wait<span className="black"> there's more, </span>
            dig into more!
          </p>
          <FiChevronDown />
        </div>
      </div>
    </div>
  );
};

export default Match;
