import React from "react";
import { FiHome, FiMessageSquare, FiPlayCircle, FiSearch, FiUser } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";

const themeSwitch = (str) => {
  switch (str) {
    case "/":
      return "bottom-nav-hidden";
    case String(str.match(/.*feed.*/)):
      return "bottom-nav-feed";
    case String(str.match(/.*match.*/)):
      return "bottom-nav-match";
    case "/insights/toptracks":
    case "/insights/topartists":
    case "/insights/surprise":
    case "/insights/mood":
      return "bottom-nav-dashboard";
    case "/insights":
      return "bottom-nav-insights";
    case "/discover":
    case "/rolling":
      return "bottom-nav-discover";
    default:
      return "bottom-nav-myspace";
  }
};

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className={`bottom-nav ${themeSwitch(location.pathname)}`}>
      <ul>
        <Link
          to="/insights"
          className={location.pathname === "/insights" ? "selected" : ""}
        >
          <FiHome />
          <p >Insights</p>
        </Link>
        <Link
          to="/feed"
          className={location.pathname === "/feed" ? "selected" : ""}
        >
          <FiPlayCircle/>
          <p >Feed</p>
        </Link>
        <Link
          to="/discover"
          className={location.pathname === "/discover" ? "selected" : ""}
        >
          <FiSearch />
          <p >Discovery</p>
        </Link>
        <Link
          to="/chat"
          className={location.pathname === "/chat" ? "selected" : ""}
        >
          <FiMessageSquare/>
          <p >Inbox</p>
        </Link>
        <Link
          to={`/${localStorage.getItem("handle")}`}
          className={
            location.pathname === `/${localStorage.getItem("handle")}`
              ? "selected"
              : ""
          }
        >
          <FiUser />
          <p >My Space</p>
        </Link>
      </ul>
    </nav>
  );
};

export default BottomNav;
