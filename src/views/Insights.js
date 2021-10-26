import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ImageSlider from "../components/ImageSlider";
import Navbar from "../components/Navbar";
import { axiosInstance } from "../util/axiosConfig";
import axios from "axios";

const Insights = () => {
    const [name, setName] = useState("");

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {

            const payload = {
                pip: "https://api.spotify.com/v1/me",
                spotify_id: localStorage.getItem("spotifyId"),
            };


            axios
                .post(`${process.env.REACT_APP_BACKEND_URI}/spotifyget`, payload, {
                    headers: {
                        //"Content-Type": "application/json",
                        "jwt_token": localStorage.getItem("accessToken"),
                    },
                })
                .then((res) => {
                    // res=res.output;
                    // res=res.data.data;
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