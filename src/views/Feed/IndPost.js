import ColorThief from "colorthief";
import jwtDecode from "jwt-decode";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  FaHeart,
  FaPause,
  FaPlay,
  FaPlus,
  FaRegComment,
  FaRegHeart,
} from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import { VscCircleFilled } from "react-icons/vsc";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/images/logo-black.png";
import WebPlayer from "../../components/WebPlayer";
import { axiosInstance } from "../../util/axiosConfig";
import {
  getContrastYIQ,
  rgbToHex,
  setMediaSession,
} from "../../util/functions";
import AddComment from "./AddComment";

const decodeJWT = () => {
  const access_token = localStorage.getItem("accessToken");
  return jwtDecode(access_token);
};

const IndPost = () => {
  const location = useLocation();
  const [feedId, setFeedId] = useState(null);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentPageId, setCommentPageId] = useState(0);
  const [loadMoreComments, setLoadMoreComments] = useState(true);
  const [userId, setUserId] = useState("");
  const [showAddComment, setShowAddComment] = useState(false);
  const [bgc, setBgc] = useState("");
  const [currentSong, setCurrentSong] = useState({
    audioUrl: null,
    songName: "",
    artists: "",
    imageUrl: null,
  });

  const fetchPostInfo = () => {
    axiosInstance
      .get(`/feed/${feedId}`)
      .then((res) => {
        setPost(res.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchComments = () => {
    axiosInstance
      .get(`/feed/allcomments/${feedId}/${commentPageId}`)
      .then((res) => {
        if (res.data.length === 0) {
          setLoadMoreComments(false);
        } else {
          setComments((prev) => [...prev, ...res.data]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const setBgColor = () => {
    const div = document.querySelector(`div#post-${feedId}`);
    const buttons = document.querySelectorAll("div.load-more > button");

    const colorThief = new ColorThief();
    const img = new Image();
    img.addEventListener("load", () => {
      const [r, g, b] = colorThief.getColor(img);
      const color = rgbToHex(r, g, b);
      setBgc(color);
      div.style.backgroundColor = color;

      const textColor = getContrastYIQ(color);
      div.style.color = textColor;
      for (const btn of buttons) {
        btn.style.color = textColor;
        btn.style.borderColor = textColor;
      }
    });

    img.crossOrigin = "Anonymous";
    img.src = post.image_url;
  };

  useEffect(() => {
    const result = decodeJWT();
    setUserId(result.user.id);
  }, []);

  useEffect(() => {
    if (location.pathname) {
      setFeedId(location.pathname.slice(6));
    }
  }, [location.pathname]);

  useEffect(() => {
    if (feedId) {
      fetchPostInfo();
    }
  }, [feedId]);

  useEffect(() => {
    if (feedId && commentPageId >= 0) {
      fetchComments();
    }
  }, [feedId, commentPageId]);

  useEffect(() => {
    if (post) {
      setBgColor();
    }
  }, [post]);

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

  const likePost = () => {
    axiosInstance
      .put(`/feed/${post.feed_id}`)
      .then((res) => {
        const updatedPost = { ...post };
        if (updatedPost.likes.includes(userId)) {
          updatedPost.likes = updatedPost.likes.filter((i) => i !== userId);
        } else {
          updatedPost.likes.push(userId);
        }
        setPost(updatedPost);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const likeComment = (commentId) => {
    axiosInstance
      .put(`/feed/comment/${commentId}`)
      .then((res) => {
        const updatedComments = comments.map((item) => {
          if (item.comment_id !== commentId) return item;
          if (item.likes.includes(userId)) {
            item.likes = item.likes.filter((i) => i !== userId);
          } else {
            item.likes.push(userId);
          }
          return item;
        });
        setComments(updatedComments);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAddComment = (data) => {
    const payload = {
      ...data,
      feed_id: feedId,
    };
    axiosInstance
      .post("/feed/comment", payload)
      .then((res) => {
        console.log(res.data);
        setComments([{ ...res.data }, ...comments]);
        setShowAddComment(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const toggleSong = () => {
    if (currentSong.audioUrl) {
      stopSong();
    } else {
      setCurrentSong({
        audioUrl: post.preview_url,
        songName: post.name,
        imageUrl: post.image_url,
        artists: post.artists.map((item) => item.name).join(", "),
      });
    }
  };

  const stopSong = () => {
    setCurrentSong({
      audioUrl: null,
      songName: "",
      artists: "",
      imageUrl: null,
    });
  };

  return (
    <div className="ind-post-container">
      <div className="ind-post-wrapper">
        {post ? (
          <div id={`post-${post.feed_id}`} className="ind-post">
            <div className="post-container">
              <Link to={`/${post.username}`} className="post-header">
                <div className="image-container">
                  <img
                    src={post.user_url || logo}
                    alt={`${post.display_name}'s Profile`}
                  />
                </div>
                <div className="content-container">
                  <p>{post.display_name}</p>
                  <div className="meta">
                    <p>@{post.username}</p>
                    <p>
                      <span>
                        <VscCircleFilled />
                      </span>{" "}
                      {moment(post.created_at).fromNow()}
                    </p>
                  </div>
                </div>
              </Link>
              <div className="post-content">
                <p>{post.vibe}</p>
              </div>
              <div
                className={`post-song ${
                  currentSong.audioUrl &&
                  currentSong.audioUrl === post.preview_url
                    ? "focus"
                    : ""
                }`}
                onClick={toggleSong}
              >
                <div className="image-container">
                  <img src={post.image_url || logo} alt={post.name} />
                  {currentSong.audioUrl &&
                  currentSong.audioUrl === post.preview_url ? (
                    <FaPause />
                  ) : (
                    <FaPlay />
                  )}
                </div>
                <div className="content-container">
                  <p>{post.name}</p>
                  <div className="meta">
                    <p>
                      {post.artists
                        .map((item) => item.name)
                        .slice(0, 3)
                        .join(", ")}
                    </p>
                  </div>
                </div>
              </div>
              <div className="post-socials">
                <button onClick={likePost}>
                  {userId && post.likes.includes(userId) ? (
                    <FaHeart />
                  ) : (
                    <FaRegHeart />
                  )}
                  <span>{post.likes.length}</span>
                </button>
                <Link to={`/feed/${post.feed_id}`}>
                  <FaRegComment /> <span>{comments.length}</span>
                </Link>
                <button>
                  <FiUpload />
                </button>
              </div>
            </div>
            <div className="comments-container">
              <div className="comments-header">
                <p>Comments</p>
                <div className="load-more add-comment">
                  <button onClick={() => setShowAddComment(true)}>
                    <span>
                      <FaPlus></FaPlus>
                    </span>
                    Add Comment
                  </button>
                </div>
              </div>
              <div className="comments-list">
                {comments.length > 0 &&
                  comments.map((comment) => (
                    <div key={comment.comment_id} className="comment">
                      <div className="image-container">
                        <img
                          src={comment.image_url || logo}
                          alt={`${comment.display_name}'s Profile`}
                        />
                      </div>
                      <div className="content-container">
                        <Link
                          to={`/${comment.username}`}
                          className="content-header"
                        >
                          <p>{comment.display_name}</p>
                          <div className="meta">
                            <p>@{comment.username}</p>
                            <p>
                              <span>
                                <VscCircleFilled />
                              </span>{" "}
                              {moment(comment.created_at).fromNow()}
                            </p>
                          </div>
                        </Link>
                        <p className="comment-main">{comment.comment}</p>
                        <div className="comment-socials">
                          <button
                            onClick={() => likeComment(comment.comment_id)}
                          >
                            {userId && comment.likes.includes(userId) ? (
                              <FaHeart />
                            ) : (
                              <FaRegHeart />
                            )}
                            <p>{comment.likes.length}</p>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                {loadMoreComments ? (
                  <div className="load-more">
                    <button
                      onClick={() => setCommentPageId((prev) => prev + 1)}
                    >
                      Load More Comments
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
        {showAddComment ? (
          <AddComment
            bgColor={bgc}
            closeModal={() => setShowAddComment(false)}
            submitData={handleAddComment}
          />
        ) : null}
      </div>
      {currentSong.audioUrl && (
        <WebPlayer
          url={currentSong.audioUrl}
          nextPlay={stopSong}
          noControls={true}
        />
      )}
    </div>
  );
};

export default IndPost;
