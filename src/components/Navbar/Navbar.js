import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { loginUrl } from "../../util/spotify";
import { FiMenu } from "react-icons/fi";
import "./Navbar.css";

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
    <nav className={location.pathname !== "/" ? "nav-dark" : ""}>
      <div className="nav-title">Musixspace</div>
      {location.pathname !== "/" ? (
        <ul className={`nav-ul ${showLinks ? "" : "hide"}`}>
          <li className="nav-li">Contact</li>
          <li className="nav-li">Discord</li>
          <li className="nav-li">Match</li>
          <li className="nav-li" onClick={handleLogout}>
            Logout
          </li>
        </ul>
      ) : (
        <ul className={`nav-ul ${showLinks ? "" : "hide"}`}>
          <li className="nav-li">About</li>
          <li className="nav-li">
            <a href={loginUrl}>Login</a>
          </li>
        </ul>
      )}
      <div onClick={toggleMenu} className="ham">
        <FiMenu />
      </div>
    </nav>
  );
};

export default Navbar;
