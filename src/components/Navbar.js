import React, { useEffect, useState } from "react";
import { FaRegBell } from "react-icons/fa";
import { FiLogOut, FiMenu, FiRefreshCcw, FiX } from "react-icons/fi";
import { Link, Redirect, useHistory, useLocation } from "react-router-dom";
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from "recoil";
import profile from "../assets/images/logo-black.png";
import { useChat } from "../context/chatContext";
import { alertAtom } from "../recoil/alertAtom";
import { openSidebarAtom } from "../recoil/openSidebarAtom";
import { userState } from "../recoil/userAtom";
import { axiosInstance } from "../util/axiosConfig";

const themeSwitch = (str) => {
  switch (str) {
    case String(str.match(/.*match.*/)):
      return "nav-match";
    case String(str.match(/.*feed.*/)):
      return "nav-feed";
    case "/readytorock":
      return "nav-transparent";
    case "/insights/toptracks":
    case "/insights/topartists":
    case "/insights/surprise":
    case "/insights/mood":
      return "nav-top-tracks";
    case "/insights":
      return "nav-insights";
    case "/chat":
      return "nav-transparent";
    case "/discover":
    case "/rolling":
      return "nav-discover";
    case "/about":
    default:
      return "nav-about";
  }
};

const loggedInLinks = [
  { name: "Insights", path: "/insights" },
  { name: "Feed", path: "/feed" },
  { name: "Inbox", path:"/chat"},
  { name: "Discover", path: "/discover" },
  { name: "My Space", path: "/myspace" },
  // { name: "Discord", path: "/discord" },
];

const Navbar = () => {
  const location = useLocation();
  const { username, image: image_url } = useRecoilValue(userState);
  const [showLinks, setShowLinks] = useRecoilState(openSidebarAtom);
  const setAlert = useSetRecoilState(alertAtom);
  const resetUser = useResetRecoilState(userState);

  const [openProfile, setOpenProfile] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const [redirectChat, setRedirectChat] = useState(null);
  const history = useHistory();

  const { notifications, setSelectedChat, setNotifications } = useChat();

  const toggleMenu = () => {
    setShowLinks((prev) => !prev);
  };

  const closeMenu = () => {
    if (showLinks) {
      setShowLinks(false);
    }
    if (openProfile) {
      setOpenProfile(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", closeMenu);

    return () => {
      window.removeEventListener("click", closeMenu);
    };
  }, [showLinks, openProfile]);

  // useEffect(() => {
  //   if (username || localStorage.getItem("handle")) {
  //     loggedInLinks[3].path = `/${username || localStorage.getItem("handle")}`;
  //   }
  // }, [username, location.pathname]);

  useEffect(() => {
    console.log("here are the notifications");
    console.log(notifications);
  }, [notifications]);

  const handleReload = () => {
    const reloadSvgList = document.querySelectorAll(".reload>svg");
    for (let i = 0; i < reloadSvgList.length; i++) {
      reloadSvgList[i].classList.toggle("spin");
    }
    setAlert({
      open: true,
      message: `Fetching data from Spotify...`,
      type: "info",
    });
    axiosInstance
      .get("/refresh")
      .then((res) => {
        console.log(res);
        for (let i = 0; i < reloadSvgList.length; i++) {
          reloadSvgList[i].classList.toggle("spin");
        }
        resetUser();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const goToChat = (item) => {
    console.log(item);
    // setSelectedChat({
    //   chat_id: item.chatId,
    //   participants: [item.from_id, item.to_id],
    // });
    // history.push("/chat", { chat_id: item.chatId });
    if (item.notification_type === "chat") setRedirectChat(item.chatId);
    else setRedirectChat("req");
    setNotifications([]);
  };

  if (redirectChat) {
    return (
      <Redirect to={{ pathname: "/chat", state: { chat_id: redirectChat } }} />
    );
  }

  return (
    <nav
      className={
        location.pathname === "/" ? "nav-beta" : themeSwitch(location.pathname)
      }
    >
      <div className="nav-title">
        <Link to={localStorage.getItem("accessToken") ? "/insights" : "/"}>
          Musixspace
        </Link>
      </div>
      {localStorage.getItem("accessToken") ? (
        <>
          <ul className={`nav-ul ${showLinks ? "" : "hide"}`}>
            <div className="mobile-top">
              <div className="profile">
                <div className="profile-img">
                  <img src={image_url || profile} alt="Profile" />
                </div>
              </div>
              <div onClick={toggleMenu}>
                <FiX />
              </div>
            </div>
            {/* {location.pathname !== "/readytorock" &&
              location.pathname !== "/rolling" && */}
              {loggedInLinks.map((item) => (
                <li
                  key={item.name}
                  className={`nav-li ${
                    location.pathname === item.path ? "underline" : ""
                  }`}
                >
                  {item.path === "/myspace" && username ? (
                    <Link to={`/${username}`}>{item.name}</Link>
                  ) : (
                    <Link to={item.path}>{item.name}</Link>
                  )}
                </li>
              ))}
            <li className="nav-li mobile">
              <Link to="/about">About</Link>
            </li>
            <li className="nav-li mobile">
              <Link to="/logout">Logout</Link>
            </li>
            <div className="profile">
              <div
                className="notification"
                onClick={() => {
                  setOpenNotification((prev) => !prev);
                }}
              >
                {notifications.length > 0 && (
                  <span>{notifications.length}</span>
                )}
                {/* <FaRegBell /> */}
              </div>
              {openNotification && notifications.length > 0 && (
                <ul className="profile-ul notification-ul">
                  {notifications.map((item, index) => (
                    <li key={item.created_at} className="profile-li">
                      <div
                        onClick={(e) => {
                          goToChat(item);
                        }}
                      >
                        {item.type === "text"
                          ? `Someone sent you a message : ${item.content.message}`
                          : `Someone sent you a song : ${item.content.name}`}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <div className="reload" onClick={handleReload}>
                <FiRefreshCcw />
              </div>
              <div
                className="profile-img"
                onClick={() => setOpenProfile((prev) => !prev)}
              >
                <img src={image_url || profile} alt="Profile" />
              </div>
              {openProfile && (
                <ul className="profile-ul">
                  <li className="profile-li">
                    <Link to="/about">About</Link>
                  </li>
                  <li className="profile-li">
                    <Link to="/logout">Logout</Link>
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
              <img src={image_url || profile} alt="Profile" />
            </div>
          </div>
        </>
      ) : (
        <ul className={`nav-ul ${showLinks ? "" : "hide"}`}>
          <div className="mobile-top">
            <div className="profile">
              <div className="profile-img">
                <img src={image_url || profile} alt="Profile" />
              </div>
            </div>
            <div onClick={toggleMenu}>
              <FiX />
            </div>
          </div>
          {/* <li className="nav-li">Discord</li> */}
          <li
            className={`nav-li ${
              location.pathname === "/about" ? "underline" : ""
            }`}
          >
            <Link to="/about">About</Link>
          </li>
        </ul>
      )}
      <div className="ham">
        {localStorage.getItem("accessToken") ? (
          <>
            <div
              className="notification"
              onClick={() => {
                setOpenNotification((prev) => !prev);
              }}
            >
              {notifications.length > 0 && <span>{notifications.length}</span>}
              {/* <FaRegBell /> */}
            </div>
            {openNotification && (
              <ul className="profile-ul notification-ul">
                {notifications.map((item, index) => (
                  <li className="profile-li">
                    <div
                      onClick={(e) => {
                        goToChat(item);
                      }}
                    >
                      Someone sent you a message : {item.content.message}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <button className="reload" onClick={handleReload}>
              <FiRefreshCcw />
            </button>
            <button>
              <Link to="/logout">
                <FiLogOut />
              </Link>
            </button>
          </>
        ) : showLinks ? (
          <FiX />
        ) : (
          <FiMenu onClick={toggleMenu} />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
