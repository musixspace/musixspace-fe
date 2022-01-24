import jwtDecode from "jwt-decode";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  FaHashtag,
  FaHeart,
  FaPlus,
  FaRegComment,
  FaRegHeart,
  FaSearch,
} from "react-icons/fa";
import { FiSkipForward } from "react-icons/fi";
import { GiSpeaker, GiSpeakerOff } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { useRecoilValue, useSetRecoilState } from "recoil";
import logo from "../../assets/images/logo-black.png";
import WebPlayer from "../../components/WebPlayer";
import useDebounceCallback from "../../hooks/useDebounce";
import { alertAtom } from "../../recoil/alertAtom";
import { userState } from "../../recoil/userAtom";
import { axiosInstance } from "../../util/axiosConfig";
import { nFormatter, setMediaSession } from "../../util/functions";

const decodeJWT = () => {
  const access_token = localStorage.getItem("accessToken");
  return jwtDecode(access_token);
};

const Feed = () => {
  const currentUser = useRecoilValue(userState);
  const setAlert = useSetRecoilState(alertAtom);
  const [posts, setPosts] = useState([]);
  const [pageId, setPageId] = useState(0);
  const [index, setIndex] = useState(0);
  const [addPost, setAddPost] = useState(false);
  const [userId, setUserId] = useState("");
  const [currentSong, setCurrentSong] = useState({
    audioUrl: null,
    songName: "",
    artists: "",
    imageUrl: null,
  });
  const [display, setDisplay] = useState(false);
  const [touch, setTouch] = useState({
    start: null,
    end: null,
  });

  const [data, setData] = useState({
    vibe: "",
    anthem: {
      id: null,
      name: "",
    },
  });
  const [anthemStore, setAnthemStore] = useState([]);

  const fetchPosts = () => {
    axiosInstance
      .get(`/feed/all/${pageId}`)
      .then((res) => {
        const newPosts = [...posts, ...res.data];
        setPosts(newPosts);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const result = decodeJWT();
    setUserId(result.user.id);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [pageId]);

  useEffect(() => {
    toggleAudioUrl(posts[index]);
    const container = document.querySelector(".feed");
    if (container) {
      let children = container.children;
      if (children[0]) {
        children = container.querySelector(`.ind-post:nth-child(${index + 1})`);
        container.scrollTo({
          top: children.offsetTop,
          behavior: "smooth",
        });
      }

      if (index === posts.length - 3) {
        setPageId((prev) => prev + 1);
      }
    }
  }, [index]);

  useEffect(() => {
    if (currentSong.audioUrl) {
      setMediaSession(
        currentSong.name,
        currentSong.artists,
        currentSong.imageUrl,
        null,
        null
      );
    }
  }, [currentSong.audioUrl]);

  useEffect(() => {
    if (touch.start && touch.end) {
      if (touch.start - touch.end > 75) {
        nextPost();
      } else if (touch.end - touch.start > 75) {
        prevPost();
      }
    }
  }, [touch.start, touch.end]);

  const apiCall = useDebounceCallback((value) => {
    axiosInstance
      .post("/search", { query: value, type: "track" })
      .then((res) => {
        console.log(res.data);
        setAnthemStore(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, 1000);

  useEffect(() => {
    if (!data.anthem.id && data.anthem.name) {
      apiCall(data.anthem.name);
    }
  }, [data.anthem.name]);

  const prevPost = () => {
    if (index !== 0) {
      setIndex((prevIndex) => prevIndex - 1);
    }
  };

  const nextPost = () => {
    if (index !== posts.length - 1) {
      setIndex((prevIndex) => prevIndex + 1);
    }
  };

  const likePost = (feedId) => {
    axiosInstance
      .put(`/feed/${feedId}`)
      .then((res) => {
        const allPosts = posts.map((item) => {
          if (item.feed_id === feedId) {
            if (item.likes.includes(userId)) {
              item.likes = item.likes.filter((i) => i !== userId);
            } else {
              item.likes.push(userId);
            }
          }
          return item;
        });
        setPosts(allPosts);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const toggleAudioUrl = (item) => {
    setDisplay(true);

    setTimeout(() => {
      setDisplay(false);
    }, 800);

    if (
      (!currentSong.audioUrl || currentSong.audioUrl !== item.preview_url) &&
      item?.preview_url
    ) {
      setCurrentSong({
        audioUrl: item.preview_url,
        imageUrl: item.image_url,
        songName: item.name,
        artists: item.artists.map((i) => i.name).join(", "),
      });
    } else {
      setCurrentSong({ ...currentSong, audioUrl: null });
    }
  };

  const handleTouchStart = (e) => {
    setTouch({ start: parseInt(e.touches[0].clientY), end: null });
  };

  const handleTouchEnd = (e) => {
    setTouch({ ...touch, end: parseInt(e.changedTouches[0].clientY) });
  };

  const handleAddPost = () => {
    axiosInstance
      .post("/feed", { vibe: data.vibe, song_id: data.anthem.id })
      .then((res) => {
        console.log(res);
        setAlert({
          open: true,
          type: "success",
          message: res.data,
        });
        setData({ anthem: { ...data.anthem, id: null, name: "" }, vibe: "" });
      })
      .catch((err) => {
        setAlert({
          open: true,
          type: "error",
          message: err.response.data.msg,
        });
        console.log(err);
      });
  };

  return (
    <div className="feed-container">
      {addPost ? (
        <div className="feed-wrapper">
          <div className="feed">
            <div className="ind-post">
              <div className="image-container">
                <img
                  src={
                    (currentUser &&
                      currentUser.anthem &&
                      currentUser.anthem.image_url) ||
                    logo
                  }
                  alt="Dummy"
                />
              </div>
              <div className="input-container">
                <div className="input-fields">
                  <p>Search for your masterpiece</p>
                  <div>
                    <FaSearch />
                    <input
                      value={data.anthem.name}
                      onChange={(e) =>
                        setData({
                          ...data,
                          anthem: { id: null, name: e.target.value },
                        })
                      }
                      type="text"
                    />
                  </div>

                  {anthemStore.length > 0 && (
                    <ul className="anthem-options">
                      {!data.anthem.id &&
                        anthemStore.map((item) => (
                          <li
                            key={item.id}
                            onClick={() => {
                              setData({
                                ...data,
                                anthem: { id: item.id, name: item.name },
                              });
                              setAnthemStore([]);
                            }}
                          >
                            <div className="image-container">
                              <img src={item.image_url} alt={item.name} />
                            </div>
                            <span>{item.name}</span>
                          </li>
                        ))}
                    </ul>
                  )}
                  <p>Add the #vibe</p>
                  <div>
                    <FaHashtag />
                    <input
                      value={data.vibe}
                      onChange={(e) =>
                        setData({ ...data, vibe: e.target.value })
                      }
                      type="text"
                    />
                  </div>
                </div>

                <div className="button-div">
                  <button
                    className={`${data.anthem.id && data.vibe ? "" : "hide"}`}
                    onClick={handleAddPost}
                  >
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        posts &&
        posts.length > 0 && (
          <div className="feed-wrapper">
            <FiSkipForward
              onClick={prevPost}
              style={{ visibility: index !== 0 ? "visible" : "hidden" }}
            />
            <div
              className="feed"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {posts.map((item) => (
                <div
                  key={item.feed_id}
                  className="ind-post"
                  onClick={() => toggleAudioUrl(item)}
                >
                  <div className="image-container">
                    <img src={item.image_url} alt="Dummy" />
                  </div>
                  <div className="content-container">
                    <p className="vibe">#{item.vibe}</p>
                    <div className="main-content">
                      <div className="user-info">
                        <div>
                          <div className="user-image">
                            <img src={item.user_url || logo} alt="Dummy" />
                          </div>
                          <div className="user-meta">
                            <p className="name">{item.display_name}</p>
                            <p className="time">
                              {moment(item.created_at).fromNow()}
                            </p>
                          </div>
                        </div>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            likePost(item.feed_id);
                          }}
                        >
                          {userId && item.likes.includes(userId) ? (
                            <FaHeart />
                          ) : (
                            <FaRegHeart />
                          )}
                          <span>{nFormatter(item.likes.length)}</span>
                        </div>
                      </div>
                      <div className="song-info">
                        <div>
                          <p className="name">{item.name}</p>
                          <p className="artist">
                            {item.artists
                              .map((i) => i.name)
                              .slice(0, 5)
                              .join(", ")}
                          </p>
                        </div>
                        <div>
                          <FaRegComment />
                          <span>{nFormatter(+item.total_comments)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="overlay">
                    <div
                      className="controls"
                      style={{ display: display ? "" : "none" }}
                    >
                      {currentSong.audioUrl === item.preview_url ? (
                        // <AiFillCaretRight />
                        <GiSpeaker />
                      ) : (
                        // <AiOutlinePause />
                        <GiSpeakerOff />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <FiSkipForward
              onClick={nextPost}
              style={{
                visibility: index !== posts.length - 1 ? "visible" : "hidden",
              }}
            />
          </div>
        )
      )}
      {currentSong.audioUrl && (
        <WebPlayer
          url={currentSong.audioUrl}
          nextPlay={nextPost}
          noControls={true}
        />
      )}
      <button
        className="floating-button"
        onClick={() => setAddPost((prev) => !prev)}
      >
        {addPost ? <IoMdClose /> : <FaPlus />}
      </button>
    </div>
  );
};

export default Feed;
