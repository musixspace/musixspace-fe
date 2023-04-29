import React, { useEffect, useState, useMemo } from "react";
import { useWindowSize } from "../hooks/useWindowDimensions";
import { AiFillCaretRight, AiOutlinePause } from "react-icons/ai";
import { FiSearch, FiSkipBack, FiSkipForward, FiX } from "react-icons/fi";
import logo from "../assets/images/logo-black.png";
import logoWhite from "../assets/images/logo-white.png";
import useDebounceCallback from "../hooks/useDebounce";
import { axiosInstance } from "../util/axiosConfig";
import WebPlayer from "../components/WebPlayer";
import { useHistory } from "react-router-dom";
import { setMediaSession } from "../util/functions";
import Skeleton from "../components/Skeleton";
import { useRecoilState, useRecoilValue } from "recoil";
import { discoverNumber, userState } from "../recoil/userAtom";
import CustomHelmet from "../components/CustomHelmet";
import CustomImage from "../components/CustomImage";

const Discover = () => {
  const history = useHistory();
  const userStateVal = useRecoilValue(userState);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [currentUserNumber, setCurrentUserNumber] =
    useRecoilState(discoverNumber);

  const [userSearchArray, setUserSearchArray] = useState([]);
  const [audioUrl, setAudioUrl] = useState(null);
  const [touch, setTouch] = useState({
    start: null,
    end: null,
  });

  const { width } = useWindowSize();

  const isDesktop = useMemo(() => {
    return width > 976;
  }, [width]);

  useEffect(() => {
    stopAudio();
    searchAllUsersAPICall();
  }, [currentUserNumber]);

  useEffect(() => {
    if (search) {
      searchUserAPICall(search);
    } else {
      setUserSearchArray([]);
    }
  }, [search]);

  useEffect(() => {
    if (audioUrl) {
      setMediaSession(
        user.anthem.name,
        user.anthem.artists.map((i) => i.name).join(", "),
        user.anthem.image_url,
        null,
        null
      );
    }
  }, [audioUrl]);
  

  useEffect(() => {
    if (touch.start && touch.end) {
      stopAudio();
      if (touch.start - touch.end > 75) {
        handleNextUser();
      } else if (touch.end - touch.start > 75) {
        handleViewProfile();
      }
    }
  }, [touch.start, touch.end]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const stopAudio = () => {
    if (audioUrl) {
      setAudioUrl(null);
    }
  };

  const searchAllUsersAPICall = () => {
    setUser(null);
    axiosInstance
      .get(
        `/discover_all/${currentUserNumber}/${localStorage.getItem("handle")}`
      )
      .then((res) => {
        const info = res.data[0];
        populateCommonArr(info);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const searchUserAPICall = useDebounceCallback((value) => {
    axiosInstance
      .get(`/discover_search/${value}`)
      .then((res) => {
        setUserSearchArray(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  const handleSelectUser = (username) => {
    setUser(null);
    axiosInstance
      .get(`/discover_detail/${username}/${localStorage.getItem("handle")}`)
      .then((res) => {
        setSearch("");
        const info = res.data[0];
        populateCommonArr(info);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const populateCommonArr = (info) => {
    let common_arr = [];
    const common_artists = info.common_artists;
    const common_tracks = info.common_tracks;
    let i = 0;
    while (common_arr.length < 4) {
      if (i < common_artists.length) {
        common_arr.push(common_artists[i]);
      }
      if (i < common_tracks.length) {
        common_arr.push(common_tracks[i]);
      }
      i++;
      if (i >= common_artists.length && i >= common_tracks.length) {
        break;
      }
    }
    console.log(common_arr);
    const payload = {
      ...info,
      firstname: info.display_name.split(" ")[0],
      total:
        info.common_artists.length +
        info.common_tracks.length -
        common_arr.length,
      common_arr: common_arr,
    };
    setUser({ ...payload });
    setAudioUrl(payload.anthem.preview_url);
  };

  const handleViewProfile = () => {
    history.push(`/${user.username}`);
  };

  const handlePrevUser = () => {
    setCurrentUserNumber((prev) => prev - 1);
  };

  const handleNextUser = () => {
    setCurrentUserNumber((prev) => prev + 1);
  };

  const handleTouchStart = (e) => {
    setTouch({ start: parseInt(e.touches[0].clientX), end: null });
  };

  const handleTouchEnd = (e) => {
    setTouch({ ...touch, end: parseInt(e.changedTouches[0].clientX) });
  };

  return (
    <>
      <CustomHelmet
        title="Discover Users"
        description="Find people who have similar music taste"
        keywords="Discover, People"
      />
      <div className="discover-container">
        <div className="searchbar">
          <div></div>
          <div>
            <FiSearch />
            <input
              value={search}
              onChange={handleSearch}
              type="text"
              placeholder="Looking for someone?"
            />
            <FiX onClick={() => setSearch("")} />
          </div>
          <div></div>
        </div>
        {userSearchArray.length > 0 ? (
          <div className="searchbar">
            <div></div>
            <ul className="user-list">
              {userSearchArray.map((item) => (
                <li
                  key={item.username}
                  className="user"
                  onClick={() => handleSelectUser(item.username)}
                >
                  <div className="image-container">
                    <img
                      src={item.image_url || logo}
                      alt={`${item.display_name}'s Profile'`}
                    />
                    {/* <CustomImage
                      src={item.image_url}
                      alt={`${item.display_name}'s Profile'`}
                    /> */}
                  </div>
                  <div className="name">{item.display_name}</div>
                </li>
              ))}
            </ul>
            <div></div>
          </div>
        ) : (
          <div
            className="discover"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="prev">
              <FiSkipBack onClick={handlePrevUser} />
            </div>
            <div className="user">
              <div className="image-container">
                {user && user.display_name ? (
                  <img
                    src={user.image_url || logo}
                    alt={`${user.display_name}'s Profile`}
                  />
                ) : (
                  <Skeleton type="text" />
                )}
                {user && user.display_name && (
                  <div className="overlap">
                    <img src={logoWhite} alt="Musixspace Logo" />
                    <button onClick={handleViewProfile}>View Space</button>
                  </div>
                )}
              </div>
              <div className="content-container">
                <div className="main-content">
                  {user && user.display_name ? (
                    <>
                      <div className="name">{user.display_name}</div>
                      <div className="tags">
                        {user.traits &&
                          user.traits.map((tag) => (
                            <div
                              key={tag}
                              className={`tag ${
                                userStateVal.traits.length > 0 &&
                                userStateVal.traits.includes(tag)
                                  ? "selected"
                                  : ""
                              }`}
                            >
                              {tag}
                            </div>
                          ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <Skeleton type="text" />
                      <Skeleton type="text" />
                    </>
                  )}
                </div>
                <div className="inner-content">
                  <div className="anthem">
                    {user && user.display_name ? (
                      <>
                        <div className="title">{user.firstname}'s Anthem</div>
                        <div className="anthem-content">
                          <div className="anthem-image">
                            <img
                              src={
                                (user.anthem && user.anthem.image_url) || logo
                              }
                              alt={user.anthem && user.anthem.name}
                            />
                            {user.anthem && user.anthem.preview_url && (
                              <button
                                className="controls"
                                onClick={() =>
                                  audioUrl
                                    ? setAudioUrl(null)
                                    : setAudioUrl(user.anthem.preview_url)
                                }
                              >
                                {audioUrl ? (
                                  <AiOutlinePause />
                                ) : (
                                  <AiFillCaretRight />
                                )}
                              </button>
                            )}
                          </div>
                          <div>
                            <div className="anthem-title">
                              {user.anthem && user.anthem.name}
                            </div>
                            <div className="anthem-album">
                              {user.anthem &&
                                user.anthem.artists &&
                                user.anthem.artists
                                  .map((i) => i.name)
                                  .join(", ")}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <Skeleton type="text" />
                        <div className="anthem-content">
                          <div className="anthem-image">
                            <Skeleton type="text" />
                          </div>
                          <div>
                            <Skeleton type="text" />
                            <Skeleton type="text" />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="interests">
                    {user && user.display_name ? (
                      user.common_arr &&
                      user.common_arr.length > 0 && (
                        <>
                          <div className="title">{user.firstname} X You</div>
                          <div className="list">
                            {user.common_arr.map((item) => (
                              <>
                              <div key={item.name} className="artist">
                                <div>
                                  <img
                                    src={item.image_url || logo}
                                    alt={item.name}
                                  />
                                </div>
                                <span>{item.name}</span>
                              </div>
                              </>
                            ))}
                            <div className="common">
                                {user.total > 0 &&
                                  `+${user.total} common interests`}
                            </div>
                          </div>
                        </>
                      )
                    ) : (
                      <>
                        <Skeleton type="text" />
                        <div className="list">
                          <Skeleton type="text" />
                          <Skeleton type="text" />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="next">
              <FiSkipForward onClick={handleNextUser} />
            </div>
            <div className="mobile-visible">
              <FiSkipBack onClick={handlePrevUser} />
              <FiSkipForward onClick={handleNextUser} />
            </div>
          </div>
        )}
        {audioUrl && (
          <WebPlayer
            url={audioUrl}
            nextPlay={() => setAudioUrl(null)}
            noControls="true"
          />
        )}
      </div>
    </>
  );
};

export default Discover;
