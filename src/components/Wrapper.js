import React, { useEffect } from "react";
import { useLocation } from "react-router";
import { useRecoilState, useRecoilValue } from "recoil";
import { loadingAtom } from "../recoil/loadingAtom";
import { openSidebarAtom } from "../recoil/openSidebarAtom";
import Alert from "./Alert";
import BottomNav from "./BottomNav";
import Loading from "./Loading";
import Navbar from "./Navbar";

const themeSwitch = (str) => {
  switch (str) {
    case "/":
      return "--bg-home";
    case String(str.match(/.*match.*/)):
      return "--bg-match";
    case "/readytorock":
      return "--bg-transparent";
    case "/insights/toptracks":
    case "/insights/topartists":
    case "/insights/surprise":
    case "/insights/mood":
      return "--bg-top-tracks";
    case "/insights":
      return "--bg-insights";
    case "/chat":
      return "--bg-match";
    case "/discover":
    case "/rolling":
    case String(str.match(/.*feed.*/)):
      return "--clr-black";
    case "/about":
    default:
      return "--bg-about";
  }
};

const Wrapper = (props) => {
  const location = useLocation();
  const sidebarOpen = useRecoilValue(openSidebarAtom);
  const [loading, setLoading] = useRecoilState(loadingAtom);

  useEffect(() => {
    if (loading) {
      setLoading(false);
    }
  }, [location.pathname]);

  return (
    <div
      className="wrapper"
      style={{
        backgroundColor: `var(${themeSwitch(location.pathname)})`,
      }}
    >
      {location.pathname !=="/no_listening_history" ? (<Navbar />) : null}
      {sidebarOpen && <div className="dark-overlay"></div>}
      {loading ? (
        <Loading bg={`${themeSwitch(location.pathname)}`} />
      ) : (
        props.children
      )}
      {(location.pathname !=='/readytorock' || location.pathname !=='/rolling') ? <BottomNav /> : null}
      <Alert />
    </div>
  );
};

export default Wrapper;
