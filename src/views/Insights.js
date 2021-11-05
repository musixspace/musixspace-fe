import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import ImageSlider from "../components/ImageSlider";
import { loadingAtom } from "../recoil/loadingAtom";
import { userNameSelector, userState } from "../recoil/userAtom";
import { axiosInstance } from "../util/axiosConfig";

const Insights = () => {
  const displayName = useRecoilValue(userNameSelector);
  const [user, setUser] = useRecoilState(userState);
  const setLoading = useSetRecoilState(loadingAtom);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      if (!user.displayName) {
        setLoading(true);

        axiosInstance
          .post("/users")
          .then((res) => {
            console.log(res.data);
            if (res.status === 200) {
              setUser({
                displayName: res.data?.display_name,
                username: res.data?.username,
                image: res.data.image_url ? res.data.image_url : "default",
              });
              setLoading(false);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }, []);

  return (
    <div className="insights">
      <div className="content">
        <p>Hola, {displayName}!</p>
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
