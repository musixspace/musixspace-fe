import React from "react";
import Navbar from "../components/Navbar";
import image3 from "../assets/images/artists/image3.png";
import image5 from "../assets/images/artists/image5.png";

const user = {
  name: "Amaya Srivastava",
  matches: 12,
  img: image3,
  traits: ["introvert", "easy going"],
  handle: "thehopelessromantic",
  anthem: {
    title: "Nikamma",
    album: "Lifafa",
    img: image5,
  },
};

const MySpace = () => {
  return (
    <div className="wrapper" style={{ backgroundColor: "var(--bg-about)" }}>
      <Navbar />
      <div className="mySpace">
        <div className="intro">
          <div className="image-container">
            <img src={user.img} alt={`${user.name}'s Image'`} />
          </div>
          <div className="content-container">
            <div className="main">
              <p>{user.name}</p>
              <div className="sub">
                <span>{user.matches} matches</span>
                <div className="traits-container">
                  {user.traits.map((trait) => (
                    <div key={trait} className="trait">
                      {trait}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="middle">
              <p>{user.handle}</p>
              <div className="button-container">
                <button>Match</button>
              </div>
            </div>
            <div className="anthem-container">
              <div className="content">
                <div>{`${user.name.trim().split(" ")[0]}'s Anthem`}</div>
                <p>{user.anthem.title}</p>
                <p>{user.anthem.album}</p>
              </div>
              <div className="image-container">
                <img
                  src={user.anthem.img}
                  alt={`${user.name.trim().split(" ")[0]}'s Anthem'`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MySpace;
