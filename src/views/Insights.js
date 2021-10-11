import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ImageSlider from "../components/ImageSlider";
import Navbar from "../components/Navbar";
import { spotifyApi } from "../util/spotify";

const Insights = () => {
  const [name, setName] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      spotifyApi.setAccessToken(accessToken);
      spotifyApi
        .getMe()
        .then((res) => {
          if (res.statusCode === 200) {
            setName(res.body.display_name);
          }
        })
        .catch((err) => console.log(err));
    }
  }, []);

  return (
    <div className="wrapper" style={{ backgroundColor: "var(--bg-insights)" }}>
      <Navbar />
      <div className="insights">
        <div className="content">
          <p>Hola, {name}!</p>
          <div className="pages">
            <p>
              <Link to="/top-tracks">Top Tracks Radio</Link>
            </p>
            <p>Top Artists Radio</p>
            <p>Surprise Me!</p>
            <p>Mood Radio</p>
          </div>
        </div>
        <ImageSlider page={2} />
      </div>
    </div>
  );
};

export default Insights;
