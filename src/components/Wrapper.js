import React from "react";
import { useLocation } from "react-router";
import { useRecoilValue } from "recoil";
import { loadingAtom } from "../recoil/loadingAtom";
import { openSidebarAtom } from "../recoil/openSidebarAtom";
import Navbar from "./Navbar";

const themeSwitch = (str) => {
  switch (str) {
    case "/":
      return "--bg-home";
    case "/readytorock":
      return "--bg-transparent";
    case "/insights/toptracks":
    case "/insights/topartists":
    case "/insights/surprise":
    case "/insights/mood":
      return "--bg-top-tracks";
    case "/insights":
      return "--bg-insights";
    case "/discover":
    case "/rolling":
      return "--clr-black";
    case "/about":
    default:
      return "--bg-about";
  }
};

const Wrapper = (props) => {
  const location = useLocation();
  const sidebarOpen = useRecoilValue(openSidebarAtom);
  const loading = useRecoilValue(loadingAtom);
  return (
    <div
      className="wrapper"
      style={{
        backgroundColor: `var(${themeSwitch(location.pathname)})`,
      }}
    >
      <Navbar />
      {sidebarOpen && <div className="dark-overlay"></div>}
      {loading ? (
        <div
          className="loading-div"
          style={{ backgroundColor: `var(${themeSwitch(location.pathname)})` }}
        >
          <div className="lds-facebook">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      ) : (
        props.children
      )}
    </div>
  );
};

export default Wrapper;
