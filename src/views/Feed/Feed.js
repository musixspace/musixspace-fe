import jwtDecode from "jwt-decode";
import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../util/axiosConfig";
import IndPost from "./IndPost";
import WebPlayer from "../../components/WebPlayer";
import { setMediaSession } from "../../util/functions";

const decodeJWT = () => {
  const access_token = localStorage.getItem("accessToken");
  return jwtDecode(access_token);
};

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
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

  const playSong = (data) => {
    setCurrentSong({
      audioUrl: data.preview_url,
      songName: data.name,
      imageUrl: data.image_url,
      artists: data.artists.map((item) => item.name).join(", "),
    });
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
    <div className="feed-container">
      <div className="feed-wrapper">
        {posts.length > 0 &&
          posts.map((post) => (
            <IndPost
              key={post.feed_id}
              data={post}
              userId={userId}
              playSong={playSong}
              likePost={likePost}
              audioUrl={currentSong.audioUrl}
            />
          ))}
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

export default Feed;
