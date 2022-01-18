import React from "react";
import { FiHome, FiMessageSquare, FiSearch, FiUser } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";

const themeSwitch = (str) => {
  switch (str) {
    case "/":
      return "bottom-nav-hidden";
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
        </Link>
        <Link
          to="/feed"
          className={location.pathname === "/feed" ? "selected" : ""}
        >
          <FiMessageSquare />
        </Link>
        <Link
          to="/discover"
          className={location.pathname === "/discover" ? "selected" : ""}
        >
          <FiSearch />
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
        </Link>
      </ul>
    </nav>
  );
};

export default BottomNav;
