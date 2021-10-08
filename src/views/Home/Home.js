import React, { useEffect } from "react";
import img1 from "../../assets/images/arjit.png";
import img2 from "../../assets/images/image 224.png";
import img3 from "../../assets/images/image 231.png";
import "./Home.css";

const Home = () => {
  const slideAnimation = () => {
    const images = document.querySelectorAll(".image-box > img")
    setTimeout(() => {
      images[2].classList.add("hide")
      setTimeout(() => {
        images[1].classList.add("hide")
        setTimeout(() => {
          images[0].classList.add("hide")
          setTimeout(() => {
            images.forEach(item => {
              item.classList.remove("hide")
            })
          }, 5000)
        }, 10000)
      }, 10000);
    }, 5000)
  }

  useEffect(() => {
    slideAnimation()
    setInterval(() => {
      slideAnimation()  
    }, 35000);
  }, [])

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
      </div>
    </div>
  );
};

export default Home;
