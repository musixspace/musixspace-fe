import React from "react";
import logo from "../assets/images/logo-black.png";

const CustomImage = ({ src, alt, className }) => {
  const handleImageLoadError = (currentTarget) => {
    console.log("Image could not load");
    currentTarget.onerror = null;
    currentTarget.src = logo;
  };

  return (
    <img
      alt={alt || ""}
      src={src}
      onError={({ currentTarget }) => handleImageLoadError(currentTarget)}
      className={className || ""}
    />
  );
};

export default CustomImage;
