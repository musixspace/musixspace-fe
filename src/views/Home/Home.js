import React, { useState } from "react";
import img1 from "../../assets/images/arjit.png";
import img2 from "../../assets/images/image 224.png";
import img3 from "../../assets/images/image 231.png";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import "./Home.css";

const Home = () => {
  const [current, setCurrent] = useState(2);
  const [clicks, setClicks] = useState(0);

  const handleNextClick = () => {
    if (clicks === 3) {
      document.querySelectorAll(".image-box > img").forEach((item) => {
        console.log(item);
        item.classList.remove("hide");
      });
      setClicks(0);
    } else {
      document
        .querySelector(`.image-box > img:nth-child(${current + 1})`)
        .classList.add("hide");
      if (current === 0) {
        setCurrent(2);
      } else {
        setCurrent((prev) => prev - 1);
      }
      setClicks((prev) => prev + 1);
    }
  };

  return (
    <div className="home">
      <div className="content">
        <p>Come, join the music revolution.</p>
        <p>Form cross border companionships with the shared taste in music.</p>
      </div>
      <div className="image-container">
        <div className="image-box">
          <img src={img1} alt="Dummy" />
          <img src={img2} alt="Dummy" />
          <img src={img3} alt="Dummy" />
        </div>
        <button onClick={handleNextClick}>
          {clicks !== 0 && clicks % 3 === 0 ? (
            <AiOutlineLeft />
          ) : (
            <AiOutlineRight />
          )}
        </button>
      </div>
    </div>
  );
};

export default Home;
