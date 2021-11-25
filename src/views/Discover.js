import React, { useEffect, useState } from "react";
import { AiFillCaretRight, AiOutlinePause } from "react-icons/ai";
import { FiSearch, FiSkipBack, FiSkipForward, FiX } from "react-icons/fi";
import logo from "../assets/images/logo-black.png";
import logoWhite from "../assets/images/logo-white.png";
import useDebounceCallback from "../hooks/useDebounce";
import { axiosInstance } from "../util/axiosConfig";
import WebPlayer from "../components/WebPlayer";
import { useHistory } from "react-router-dom";
import { setMediaSession } from "../util/functions";

const Discover = () => {
  const history = useHistory();
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [currentUserNumber, setCurrentUserNumber] = useState(0);

  const [userSearchArray, setUserSearchArray] = useState([]);
  const [audioUrl, setAudioUrl] = useState(null);

  useEffect(() => {
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

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const searchAllUsersAPICall = () => {
    axiosInstance
      .get(
        `/discover_all/${currentUserNumber}/${localStorage.getItem("handle")}`
      )
      .then((res) => {
        const payload = {
          ...res.data[0],
          firstname: res.data[0].display_name.split(" ")[0],
          total:
            res.data[0].common_artists.length +
            res.data[0].common_tracks.length,
        };
        setUser({ ...payload });
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
    axiosInstance
      .get(`/discover_detail/${username}/${localStorage.getItem("handle")}`)
      .then((res) => {
        setSearch("");
        const payload = {
          ...res.data[0],
          firstname: res.data[0].display_name.split(" ")[0],
          total:
            res.data[0].common_artists.length +
            res.data[0].common_tracks.length,
        };
        setUser({ ...payload });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleViewProfile = (username) => {
    history.push(`/${username}`);
  };

  const handlePrevUser = () => {
    console.log("Hello");
    setCurrentUserNumber((prev) => prev - 1);
  };

  const handleNextUser = () => {
    setCurrentUserNumber((prev) => prev + 1);
  };

  return (
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
                </div>
                <div className="name">{item.display_name}</div>
              </li>
            ))}
          </ul>
          <div></div>
        </div>
      ) : (
        user && (
          <div className="discover">
            <div className="prev">
              <FiSkipBack onClick={handlePrevUser} />
            </div>
            <div className="user">
              <div className="image-container">
                <img
                  src={user.image_url || logo}
                  alt={`${user.display_name}'s Profile`}
                />
                <div className="overlap">
                  <img src={logoWhite} alt="Musixspace Logo" />
                  <button onClick={() => handleViewProfile(user.username)}>
                    View Space
                  </button>
                </div>
              </div>
              <div className="content-container">
                <div className="main-content">
                  <div className="name">{user.display_name}</div>
                  <div className="tags">
                    {user.traits &&
                      user.traits.map((tag) => (
                        <div key={tag} className="tag">
                          {tag}
                        </div>
                      ))}
                  </div>
                  {/* <div className="bio">"{user[current].bio}"</div> */}
                </div>
                <div className="inner-content">
                  <div className="anthem">
                    <div className="title">{user.firstname}'s Anthem</div>
                    <div className="anthem-content">
                      <div className="anthem-image">
                        <img
                          src={(user.anthem && user.anthem.image_url) || logo}
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
                            user.anthem.artists.map((i) => i.name).join(", ")}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="interests">
                    <div className="title">{user.firstname} X You</div>
                    <div className="list">
                      {user.common_artists &&
                        user.common_artists.length > 0 &&
                        user.common_artists.slice(0, 4).map((item) => (
                          <div key={item.name} className="artist">
                            <div>
                              <img
                                src={item.image_url || logo}
                                alt={item.name}
                              />
                            </div>
                            <span>{item.name}</span>
                          </div>
                        ))}
                    </div>
                    <div className="common">
                      {user.total &&
                        user.total - 4 > 0 &&
                        `+${user.total - 4} common interests`}
                    </div>
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
        )
      )}
      {audioUrl && (
        <WebPlayer
          url={audioUrl}
          nextPlay={() => setAudioUrl(null)}
          noControls="true"
        />
      )}
    </div>
  );
};

export default Discover;
