import React from "react";
import img from "../../assets/images/arjit.png";
import "./Home.css";

const Home = () => {
  return (
    <div className="home">
      <div className="content">
        <p>Come, join the music revolution.</p>
        <p>Form cross border companionships with the shared taste in music.</p>
      </div>
      <div className="image-container">
        <img src={img} alt="Dummy" />
      </div>
    </div>
  );
};

export default Home;
