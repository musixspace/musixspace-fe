import React, { useEffect } from "react";
import img1 from "../assets/images/artists/image1.png";
import img2 from "../assets/images/artists/image2.png";
import img3 from "../assets/images/artists/image3.png";
import img4 from "../assets/images/artists/image4.png";
import drake from "../assets/images/artists/drake.png";
import shreya from "../assets/images/artists/shreya.png";
import prateek from "../assets/images/artists/prateek.png";
import weekend from "../assets/images/artists/weekend.png";
import selena from "../assets/images/artists/selena.png";
import arijit from "../assets/images/artists/arijit.png";

const ImageSlider = ({ page }) => {
  const slideOut = (list) => {
    for (let i = 0; i < list.length; i++) {
      setTimeout(() => {
        list[i].classList.toggle("hide");
      }, [5000 * (list.length - i + 1)]);
    }
    setTimeout(() => {
      slideIn(list);
    }, [5000 * (list.length + 1) + 2000]);
  };

  const slideIn = (list) => {
    for (let i = 0; i < list.length; i++) {
      list[i].classList.toggle("hide");
    }
    slideOut(list);
  };

  useEffect(() => {
    const imageBox = document.querySelector(".image-box");
    console.log(imageBox);
    if (imageBox) {
      slideOut(imageBox.children);
    }
  }, []);

  return (
    <div className="image-container">
      {page === 1 ? (
        <div className="image-box">
          <img src={img1} alt="Dummy" />
          <img src={img2} alt="Dummy" />
          <img src={img3} alt="Dummy" />
        </div>
      ) : page === 2 ? (
        <div className="image-box">
          <img src={img2} alt="Dummy" />
          <img src={img3} alt="Dummy" />
          <img src={img4} alt="Dummy" />
        </div>
      ) : (
        <div className="image-box beta-box">
          <img src={selena} alt="Dummy" />
          <img src={shreya} alt="Dummy" />
          <img src={arijit} alt="Dummy" />
          <img src={prateek} alt="Dummy" />
          <img src={weekend} alt="Dummy" />
          <img src={img3} alt="Dummy" />
          <img src={img4} alt="Dummy" />
          <img src={drake} alt="Dummy" />
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
