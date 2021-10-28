import axios from "axios";
import React, { useState } from "react";
import { FaMusic } from "react-icons/fa";
import { GoMail, GoPencil } from "react-icons/go";

const ReadyToRock = () => {
  const [data, setData] = useState({
    email: "",
    username: "",
    anthem: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      handle: data.username,
      bio: data.anthem,
      spotify_id: localStorage.getItem("spotifyId"),
    };
    console.log("tokenaaa: " + localStorage.getItem("accessToken"));
    axios
      .post(`${process.env.REACT_APP_BACKEND_URI}/newstar`, payload, {
        headers: {
          //"Content-Type": "application/json",
          jwt_token: localStorage.getItem("accessToken"),
        },
      })
      .then((res) => {
        console.log(res);
        window.location.href = window.location.origin + "/insights";
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="readyToRock">
      <form className="container" onSubmit={handleSubmit}>
        <div className="title">Ready to rock your space?</div>
        <div className="input-fields">
          <div>
            <GoMail />
            <input
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              type="text"
              placeholder="Your rocking email"
            />
          </div>
          <div>
            <GoPencil />
            <input
              value={data.username}
              onChange={(e) => setData({ ...data, username: e.target.value })}
              type="text"
              placeholder="A cool username"
            />
          </div>
          <div>
            <FaMusic />
            <input
              value={data.anthem}
              onChange={(e) => setData({ ...data, anthem: e.target.value })}
              type="text"
              placeholder="Your Anthem"
            />
          </div>
        </div>
        <div className="button-div">
          <button type="submit">I'm Ready</button>
        </div>
      </form>
    </div>
  );
};

export default ReadyToRock;
