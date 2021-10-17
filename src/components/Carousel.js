import React, { useCallback, useEffect, useState } from "react";

const Carousel = ({ data, current }) => {
  const [images, setImages] = useState({
    img1: "",
    img2: "",
    img3: "",
  });

  const getImages = () => {
    let index = null;

    for (let i = 0; i < data.length; i++) {
      if (data[i].id === current) {
        index = i;
        break;
      }
    }

    if (index !== null) {
      setImages({
        img1: data[index].url,
        img2: data[(index + 1) % data.length].url,
        img3: data[(index + 2) % data.length].url,
      });
    }
  };

  useEffect(() => {
    if (data.length > 0) {
      console.log(data);
      console.log(current);
      getImages();
    }
  }, [data, current]);

  useEffect(() => {
    console.log(images);
  }, [images]);

  if (data.length > 0 && images.img1 && current)
    return (
      <div className="img-container">
        <img src={images.img1} alt="Poster" />
        <img src={images.img2} alt="Poster" />
        <img src={images.img3} alt="Poster" />
      </div>
    );
  else return null;
};

export default Carousel;
