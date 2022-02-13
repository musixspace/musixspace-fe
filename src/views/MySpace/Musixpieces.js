import jwtDecode from "jwt-decode";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import WebPlayer from "../../components/WebPlayer";
import { alertAtom } from "../../recoil/alertAtom";
import { userState } from "../../recoil/userAtom";
import { axiosInstance } from "../../util/axiosConfig";
import { setMediaSession } from "../../util/functions";
import AddPost from "../Feed/AddPost";
import Post from "../Feed/Post";

const decodeJWT = () => {
  const access_token = localStorage.getItem("accessToken");
  return jwtDecode(access_token);
};

const Musixpieces = ({ handle }) => {
  const location = useLocation();
  const user = useRecoilValue(userState);
  const setAlert = useSetRecoilState(alertAtom);
  const [posts, setPosts] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [loadMore, setLoadMore] = useState(true);
  const [userId, setUserId] = useState("");
  const [currentSong, setCurrentSong] = useState({
    audioUrl: null,
    songName: "",
    artists: "",
    imageUrl: null,
  });

  const [showAddPost, setShowAddPost] = useState(false);

  const fetchPosts = () => {
    axiosInstance
      .get(`/feed${location.pathname}/${pageIndex}`)
      .then((res) => {
        if (res.data.length > 0) {
          const newPosts = [...posts, ...res.data];
          setPosts(newPosts);
        } else {
          setLoadMore(false);
        }
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
  }, [pageIndex]);

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

  const handleLikePost = (feedId) => {
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

  const handleDeletePost = (feedId) => {
    axiosInstance
      .delete(`/feed/${feedId}`)
      .then((res) => {
        const allPosts = posts.filter((item) => item.feed_id !== feedId);
        setPosts(allPosts);
        setAlert({
          open: true,
          message: `Post deleted successfully!`,
          type: "success",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handlePlaySong = (data) => {
    if (currentSong.audioUrl) {
      handleStopSong();
    } else {
      setCurrentSong({
        audioUrl: data.preview_url,
        songName: data.name,
        imageUrl: data.image_url,
        artists: data.artists.map((item) => item.name).join(", "),
      });
    }
  };

  const handleStopSong = () => {
    setCurrentSong({
      audioUrl: null,
      songName: "",
      artists: "",
      imageUrl: null,
    });
  };

  const handleAddPost = (data) => {
    axiosInstance
      .post("/feed", { vibe: data.comment, song_id: data.song_id })
      .then((res) => {
        setShowAddPost(false);
        setAlert({ open: true, type: "success", message: "Post added!" });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="feed-container ">
      <p className="title">Musixpieces</p>
      <div className="feed-wrapper">
        {handle === localStorage.getItem("handle") ? (
          <div className="ind-post">
            <button
              onClick={() => setShowAddPost(true)}
              className="add-new-post"
            >
              <FaPlus /> Add New Post
            </button>
          </div>
        ) : null}
        {posts.length > 0 &&
          posts.map((post) => (
            <Post
              key={post.feed_id}
              data={post}
              userId={userId}
              playSong={handlePlaySong}
              likePost={handleLikePost}
              audioUrl={currentSong.audioUrl}
              edit={true}
              deletePost={handleDeletePost}
            />
          ))}
        {showAddPost ? (
          <AddPost
            closeModal={() => setShowAddPost(false)}
            submitData={handleAddPost}
          />
        ) : null}
      </div>
      {loadMore ? (
        <div className="load-more">
          <button onClick={() => setPageIndex((prev) => prev + 1)}>
            Load More Posts
          </button>
        </div>
      ) : null}
      {currentSong.audioUrl && (
        <WebPlayer
          url={currentSong.audioUrl}
          nextPlay={handleStopSong}
          noControls={true}
        />
      )}
    </div>
  );
};

export default Musixpieces;
