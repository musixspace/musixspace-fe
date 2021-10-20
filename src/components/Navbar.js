import React, { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import profile from "../assets/images/image4.png";
import { handleLogout } from "../util/functions";
import { loginUrl } from "../util/spotify";

const themeSwitch = (str) => {
  switch (str) {
    case "/insights/toptracks":
    case "/insights/topartists":
    case "/insights/surprise":
      return "nav-top-tracks";
    case "/insights":
      return "nav-insights";
    case "/discover":
      return "nav-discover";
    case "/about":
      return "nav-about";
    default:
      return "";
  }
};

const loggedInLinks = [
  { name: "Insights", path: "/insights" },
  { name: "Discover", path: "/discover" },
  { name: "My Space", path: "/myspace" },
  { name: "Discord", path: "/discord" },
];

const Navbar = () => {
  const location = useLocation();
  const [showLinks, setShowLinks] = useState(false);

  const [openProfile, setOpenProfile] = useState(false);

  const toggleMenu = () => {
    setShowLinks((prev) => !prev);
  };

  return (
    <nav className={themeSwitch(location.pathname)}>
      <div className="nav-title">
        <Link to={localStorage.getItem("accessToken") ? "/insights" : "/"}>
          Musixspace
        </Link>
      </div>
      {localStorage.getItem("accessToken") ? (
        <>
          <ul className={`nav-ul ${showLinks ? "" : "hide"}`}>
            {loggedInLinks.map((item) => (
              <li
                key={item.name}
                className={`nav-li ${
                  location.pathname === item.path ? "underline" : ""
                }`}
              >
                <Link to={item.path}>{item.name}</Link>
              </li>
            ))}
            <li className="nav-li mobile">
              <Link to="/about">About</Link>
            </li>
            <li className="nav-li mobile" onClick={handleLogout}>
              Logout
            </li>
            <div className="profile">
              <div
                className="profile-img"
                onClick={() => setOpenProfile((prev) => !prev)}
              >
                <img src={profile} alt="Profile" />
              </div>
              {openProfile && (
                <ul className="profile-ul">
                  <li className="profile-li">
                    <Link to="/about">About</Link>
                  </li>
                  <li className="profile-li" onClick={handleLogout}>
                    Logout
                  </li>
                </ul>
              )}
            </div>
          </ul>
          <div className="profile-small">
            <div
              className="profile-img"
              onClick={() => setOpenProfile((prev) => !prev)}
            >
              <img src={profile} alt="Profile" />
            </div>
          </div>
        </>
      ) : (
        <ul className={`nav-ul ${showLinks ? "" : "hide"}`}>
          <li className="nav-li">Discord</li>
          <li
            className={`nav-li ${
              location.pathname === "/about" ? "underline" : ""
            }`}
          >
            <Link to="/about">About</Link>
          </li>
          <li className="nav-li">
            <a href={loginUrl}>Login</a>
          </li>
        </ul>
      )}
      <div onClick={toggleMenu} className="ham">
        {localStorage.getItem("accessToken") ? (
          showLinks ? (
            <FiX />
          ) : (
            <div className="profile">
              <div className="profile-img">
                <img src={profile} alt="Profile" />
              </div>
            </div>
          )
        ) : showLinks ? (
          <FiX />
        ) : (
          <FiMenu />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
