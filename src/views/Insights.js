import axios from "axios";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import ImageSlider from "../components/ImageSlider";
import { loadingAtom } from "../recoil/loadingAtom";
import { userState } from "../recoil/userAtom";
import { userNameSelector } from "../recoil/userNameSelector";

const Insights = () => {
  const username = useRecoilValue(userNameSelector);
  const [user, setUser] = useRecoilState(userState);
  const setLoading = useSetRecoilState(loadingAtom);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      if (!user.username) {
        setLoading(true);
        const payload = {
          pip: "https://api.spotify.com/v1/me",
          spotify_id: localStorage.getItem("spotifyId"),
        };

        axios
          .post(`${process.env.REACT_APP_BACKEND_URI}/spotifyget`, payload, {
            headers: {
              //"Content-Type": "application/json",
              jwt_token: localStorage.getItem("accessToken"),
            },
          })
          .then((res) => {
            // res=res.output;
            // res=res.data.data;
            console.log(res);
            if (res.status === 200) {
              let name = res.data.display_name.split(" ")[0];
              setUser({ ...user, username: name });
            }
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  }, []);

  return (
    <div className="insights">
      <div className="content">
        <p>Hola, {username}!</p>
        <ul className="pages">
          <li className="pages-li">
            <Link to="/insights/toptracks">Top Tracks Radio</Link>
          </li>
          <li className="pages-li">
            <Link to="/insights/topartists">Top Artists Radio</Link>
          </li>
          <li className="pages-li">
            <Link to="/insights/surprise">Surprise Me!</Link>
          </li>
          <li className="pages-li">
            <Link to="/insights/mood">Mood Radio</Link>
          </li>
        </ul>
      </div>
      <ImageSlider page={2} />
    </div>
  );
};

export default Insights;
