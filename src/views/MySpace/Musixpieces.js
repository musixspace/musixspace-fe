import jwtDecode from "jwt-decode";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FiSkipForward } from "react-icons/fi";
import { GiSpeaker, GiSpeakerOff } from "react-icons/gi";
import { MdDelete } from "react-icons/md";
import { useSetRecoilState } from "recoil";
import logo from "../../assets/images/logo-black.png";
import WebPlayer from "../../components/WebPlayer";
import { alertAtom } from "../../recoil/alertAtom";
import { axiosInstance } from "../../util/axiosConfig";
import { nFormatter, setMediaSession } from "../../util/functions";
import { useLocation } from "react-router-dom";

const decodeJWT = () => {
  const access_token = localStorage.getItem("accessToken");
  return jwtDecode(access_token);
};

const Musixpieces = () => {
  const setAlert = useSetRecoilState(alertAtom);
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [pageId, setPageId] = useState(0);
  const [index, setIndex] = useState(0);
  const [userId, setUserId] = useState("");
  const [currentSong, setCurrentSong] = useState({
    audioUrl: "",
    songName: "",
    artists: "",
    imageUrl: null,
  });
  const [touch, setTouch] = useState({
    start: null,
    end: null,
  });
  const [display, setDisplay] = useState(false);

  const fetchPosts = () => {
    axiosInstance
      .get(`/feed${location.pathname}/${pageId}`)
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

  const prevPost = () => {
    setIndex((prevIndex) => prevIndex - 1);
  };

  const nextPost = () => {
    setIndex((prevIndex) => prevIndex + 1);
  };

  const likePost = (feedId) => {
    axiosInstance
      .put(`/feed/${feedId}`)
      .then((res) => {
        setAlert({ open: true, type: "success", message: res.data });
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
        setAlert({ open: true, type: "error", message: err.response.data.msg });
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

  const deleteFeed = async (feedId, idx) => {
    try {
      const res = await axiosInstance.delete(`/feed/${feedId}`);
      // Calculating next index to show, by default it will show next post after deletion
      let newIndex = idx;
      // If current index is last post, then set the new index to current - 1
      if (idx === posts.length - 1) {
        // If only one post is present, set index to 0
        if (idx === 0) {
          newIndex = 0;
        } else {
          newIndex = idx - 1;
        }
      }

      // Filter posts
      const newPosts = posts.filter((post) => post.feed_id !== feedId);
      setPosts(newPosts);
      setIndex(newIndex);
      setAlert({ open: true, type: "success", message: res.data });
    } catch (err) {
      setAlert({ open: true, type: "error", message: err.response.data.msg });
    }
  };

  const handleTouchStart = (e) => {
    setTouch({ start: parseInt(e.touches[0].clientY), end: null });
  };

  const handleTouchEnd = (e) => {
    setTouch({ ...touch, end: parseInt(e.changedTouches[0].clientY) });
  };

  return (
    <div className="feed-container">
      <div className="feed-wrapper">
        <p>Musixpieces</p>
        <div className="feed-nav">
          <FiSkipForward
            onClick={prevPost}
            style={{ visibility: index !== 0 ? "visible" : "hidden" }}
          />
          <div
            className="feed"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {posts.map((item, idx) => (
              <div
                key={item.feed_id}
                className="ind-post"
                onClick={() => toggleAudioUrl(item)}
              >
                <div className="image-container">
                  <img src={item.image_url} alt="Dummy" />
                </div>
                <div className="content-container">
                  <div className="header-container">
                    <p className="vibe">#{item.vibe}</p>
                    {item.user_id === userId && (
                      <button
                        title="Delete Post"
                        className="delete-feed"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteFeed(item.feed_id, idx);
                        }}
                      >
                        <MdDelete />
                      </button>
                    )}
                  </div>
                  <div className="main-content">
                    <div className="user-info">
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
                  </div>
                </div>
                <div className="overlay">
                  <div
                    className="controls"
                    style={{ display: display ? "" : "none" }}
                  >
                    {currentSong.audioUrl === item.preview_url ? (
                      <GiSpeaker />
                    ) : (
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
      </div>
      {currentSong.audioUrl && (
        <WebPlayer
          url={currentSong.audioUrl}
          nextPlay={nextPost}
          noControls={true}
        />
      )}
    </div>
  );
};

export default Musixpieces;
