import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import CustomHelmet from "../components/CustomHelmet";
import ImageSlider from "../components/ImageSlider";
import useProfile from "../hooks/useProfile";
import { userNameSelector } from "../recoil/userAtom";

const Insights = () => {
  const displayName = useRecoilValue(userNameSelector);
  const { getUserProfile } = useProfile();

  useEffect(() => {
    if (!displayName && localStorage.getItem("handle")) {
      getUserProfile(localStorage.getItem("handle"));
    }
  }, [displayName]);

  return (
    <>
      <CustomHelmet
        title="Insights"
        description="Get insights about your music taste"
        keywords="Insights, Top Tracks, Top Artists, Recommendations, Mood Radio"
      />
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
    </>
  );
};

export default Insights;
