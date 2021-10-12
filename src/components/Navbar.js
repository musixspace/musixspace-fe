import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { loginUrl } from "../util/spotify";
import { FiMenu, FiX } from "react-icons/fi";

const themeSwitch = (str) => {
  switch (str) {
    case "/top-tracks":
      return "nav-top-tracks";
    case "/insights":
      return "nav-insights";
    case "/about":
      return "nav-about";
    default:
      return "";
  }
};

const Navbar = () => {
  const location = useLocation();
  const [showLinks, setShowLinks] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location = "/";
  };

  const toggleMenu = () => {
    setShowLinks((prev) => !prev);
  };

  return (
    <nav className={themeSwitch(location.pathname)}>
      <div className="nav-title">Musixspace</div>
      {localStorage.getItem("accessToken") ? (
        <ul className={`nav-ul ${showLinks ? "" : "hide"}`}>
          <li className="nav-li">
            <Link to="/insights">Insights</Link>
          </li>
          <li className="nav-li">Discover</li>
          <li className="nav-li">My Space</li>
          <li className="nav-li">Discord</li>
          <li className="nav-li">
            <Link to="/about">About</Link>
          </li>
          <li className="nav-li" onClick={handleLogout}>
            Logout
          </li>
        </ul>
      ) : (
        <ul className={`nav-ul ${showLinks ? "" : "hide"}`}>
          <li className="nav-li">
            <Link to="/about">About</Link>
          </li>
          <li className="nav-li">
            <a href={loginUrl}>Login</a>
          </li>
        </ul>
      )}
      <div onClick={toggleMenu} className="ham">
        {showLinks ? <FiX /> : <FiMenu />}
      </div>
    </nav>
  );
};

export default Navbar;
