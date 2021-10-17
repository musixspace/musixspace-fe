import React, { useEffect } from "react";
import img1 from "../assets/images/image1.png";
import img2 from "../assets/images/image2.png";
import img3 from "../assets/images/image3.png";
import img4 from "../assets/images/image4.png";

const ImageSlider = ({ page }) => {
  const slideAnimation = () => {
    const images = document.querySelectorAll(".image-box > img");
    setTimeout(() => {
      images[2].classList.add("hide");
      setTimeout(() => {
        images[1].classList.add("hide");
        setTimeout(() => {
          images[0].classList.add("hide");
          setTimeout(() => {
            images.forEach((item) => {
              item.classList.remove("hide");
            });
          }, 2000);
        }, 10000);
      }, 10000);
    }, 5000);
  };

  useEffect(() => {
    slideAnimation();
    const interval = setInterval(() => {
      slideAnimation();
    }, 27000);

    return () => {
      console.log("Cleanup running...");
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="image-container">
      {page === 1 ? (
        <div className="image-box">
          <img src={img1} alt="Dummy" />
          <img src={img2} alt="Dummy" />
          <img src={img3} alt="Dummy" />
        </div>
      ) : (
        <div className="image-box">
          <img src={img2} alt="Dummy" />
          <img src={img3} alt="Dummy" />
          <img src={img4} alt="Dummy" />
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
