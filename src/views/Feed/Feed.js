import jwtDecode from "jwt-decode";
import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../util/axiosConfig";
import Post from "./Post";
import WebPlayer from "../../components/WebPlayer";
import { setMediaSession } from "../../util/functions";
import Skeleton from "../../components/Skeleton";

const decodeJWT = () => {
  const access_token = localStorage.getItem("accessToken");
  return jwtDecode(access_token);
};

const Feed = () => {
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

  const fetchPosts = () => {
    axiosInstance
      .get(`/feed/all/${pageIndex}`)
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

  return (
    <div className="feed-container">
      <div className="feed-wrapper">
        {posts.length > 0
          ? posts.map((post) => (
              <Post
                key={post.feed_id}
                data={post}
                userId={userId}
                playSong={handlePlaySong}
                likePost={handleLikePost}
                audioUrl={currentSong.audioUrl}
              />
            ))
          : [0, 1, 2, 3, 4, 5].map((item) => (
              <div className="ind-post" key={item}>
                <div className="post-header">
                  <div className="image-container" style={{ border: "none" }}>
                    <Skeleton type="text" />
                  </div>
                  <div className="content-container">
                    <Skeleton type="text" />
                    <Skeleton type="text" />
                  </div>
                </div>
                <div className="post-content">
                  <Skeleton type="text" />
                </div>
                <div className="post-song">
                  <div className="image-container">
                    <Skeleton type="text" />
                  </div>
                  <div className="content-container">
                    <Skeleton type="text" />
                    <Skeleton type="text" />
                  </div>
                </div>
                <div className="post-socials">
                  <Skeleton type="text" />
                </div>
              </div>
            ))}
      </div>
      {loadMore && posts.length > 0 ? (
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

export default Feed;
