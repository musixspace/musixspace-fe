import React, { useEffect } from "react";
import ColorThief from "../../node_modules/colorthief/dist/color-thief.mjs";

const rgbToHex = (r, g, b) =>
  "#" +
  [r, g, b]
    .map((x) => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    })
    .join("");

const getColor = () => {
  const div = document.querySelector(".colorThief");

  const colorThief = new ColorThief();
  const img = new Image();

  img.addEventListener("load", function () {
    const [r, g, b] = colorThief.getColor(img);
    const p = document.createElement("p");
    const color = rgbToHex(r, g, b);
    p.innerText = color;
    p.style.backgroundColor = color;
    div.appendChild(p);
  });

  img.crossOrigin = "Anonymous";
  img.src = "https://i.scdn.co/image/ab67616d0000b273563151cc3a0528d8228998c8";

  div.appendChild(img);
};
const ColorThiefExample = () => {
  useEffect(() => {
    getColor();
  }, []);
  return <div className="colorThief"></div>;
};

export default ColorThiefExample;
