import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ImageSlider from "../components/ImageSlider";
import Navbar from "../components/Navbar";
import { axiosInstance } from "../util/axiosConfig";

const Insights = () => {
  const [name, setName] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      axiosInstance
        .get("/me")
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            let name = res.data.display_name.split(" ")[0];
            setName(name);
          }
        })
        .catch((err) => {
          console.log(err);
        });
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
              <Link to="/insights/toptracks">Top Tracks Radio</Link>
            </p>
            <p>
              <Link to="/insights/topartists">Top Artists Radio</Link>
            </p>
            <p>
              <Link to="/insights/surprise">Surprise Me!</Link>
            </p>
            <p>
              <Link to="/insights/mood">Mood Radio</Link>
            </p>
          </div>
        </div>
        <ImageSlider page={2} />
      </div>
    </div>
  );
};

export default Insights;
