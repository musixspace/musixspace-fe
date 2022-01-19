import jwtDecode from "jwt-decode";
import React, { useEffect, useRef, useState } from "react";
import { AiFillCaretRight, AiOutlinePause } from "react-icons/ai";
import { GiSpeaker, GiSpeakerOff } from "react-icons/gi";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FiSkipForward } from "react-icons/fi";
import { useSetRecoilState } from "recoil";
import logo from "../../assets/images/logo-black.png";
import WebPlayer from "../../components/WebPlayer";
import { alertAtom } from "../../recoil/alertAtom";
import { axiosInstance } from "../../util/axiosConfig";
import { nFormatter, setMediaSession } from "../../util/functions";
import moment from "moment";

const decodeJWT = () => {
  const access_token = localStorage.getItem("accessToken");
  return jwtDecode(access_token);
};

const Feed = () => {
  const setAlert = useSetRecoilState(alertAtom);
  const [posts, setPosts] = useState([]);
  const [pageId, setPageId] = useState(0);
  const [index, setIndex] = useState(0);
  const [addPost, setAddPost] = useState(false);
  const [userId, setUserId] = useState("");
  const [currentSong, setCurrentSong] = useState({
    audioUrl: "",
    songName: "",
    artists: "",
    imageUrl: null,
  });
  const [display, setDisplay] = useState(false);

  const fetchPosts = () => {
    axiosInstance
      .get(`/feed/${pageId}`)
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

    // setCurrentSong({
    //   audioUrl: posts[index]?.preview_url,
    //   imageUrl: posts[index]?.image_url,
    //   songName: posts[index]?.name,
    //   artists: posts[index]?.artists.map((i) => i.name).join(", "),
    // });
  }, [index]);

  useEffect(() => {
    if (currentSong.audioUrl) {
      setMediaSession(
        currentSong.name,
        currentSong.artists,
        currentSong.imageUrl,
        null,
        null,
      );
    }
  }, [currentSong.audioUrl]);

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
            item.likes.push(userId);
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
    if (!currentSong.audioUrl) {
      setCurrentSong({
        audioUrl: item.preview_url,
        imageUrl: item.image_url,
        songName: item.name,
        artists: item.artists.map((i) => i.name).join(", "),
      });
    } else {
      setCurrentSong({ ...currentSong, audioUrl: "" });
    }
  };

  return (
    <div className="feed-container">
      {addPost ? null : (
        <div className="feed-wrapper">
          <p>Musixpieces</p>
          <div className="feed-nav">
            <FiSkipForward
              onClick={prevPost}
              style={{ visibility: index !== 0 ? "visible" : "hidden" }}
            />
            <div className="feed">
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
                            {item.artists.map((i) => i.name).join(", ")}
                          </p>
                        </div>
                        <div>
                          {userId && item.likes.includes(userId) ? (
                            <FaHeart />
                          ) : (
                            <FaRegHeart
                              onClick={(e) => {
                                e.stopPropagation();
                                likePost(item.feed_id);
                              }}
                            />
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
        </div>
      )}
      {currentSong.audioUrl && (
        <WebPlayer
          url={currentSong.audioUrl}
          nextPlay={() => {}}
          noControls={true}
        />
      )}
    </div>
  );
};

export default Feed;
