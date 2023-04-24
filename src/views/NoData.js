import React from "react";
import img2 from "../assets/images/artists/image2.png";
import img1 from "../assets/images/artists/image3.png";
import CustomHelmet from "../components/CustomHelmet";
import noData from "../assets/images/no-data.svg";

const people = [
  {
    id: 1,
    name: "Amaya Srivastava",
    position: "Music Hacker",
    img: img1,
  }
];


const NoData = () => {
  return (
    <>
      <CustomHelmet
        title="No History"
        description="No active listening history found, please try again in some time"
        keywords="Musixsapce"
      />
      <div className="no-data container-fluid">
        <a href="https://discord.gg/4EVmAEyZ"><img her style={{width:'100%'}} src={noData}></img></a>
      </div>
    </>
  );
};

export default NoData;
