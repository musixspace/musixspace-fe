import ColorThief from "colorthief";
import moment from "moment";
import React, { useLayoutEffect } from "react";
import {
  FaHeart,
  FaPause,
  FaPlay,
  FaRegComment,
  FaRegHeart,
} from "react-icons/fa";
import { FiUpload } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { VscCircleFilled } from "react-icons/vsc";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo-black.png";
import { getContrastYIQ, rgbToHex } from "../../util/functions.js";

const Post = ({
  data,
  userId,
  likePost,
  playSong,
  audioUrl,
  edit,
  deletePost,
}) => {
  useLayoutEffect(() => {
    const div = document.querySelector(`div#post-${data.feed_id}`);

    const colorThief = new ColorThief();
    const img = new Image();
    img.addEventListener("load", () => {
      const [r, g, b] = colorThief.getColor(img);
      const color = rgbToHex(r, g, b);
      div.style.backgroundColor = color;
      console.log(color);

      const textColor = getContrastYIQ(color);
      div.style.color = textColor;
      console.log(textColor);
    });

    img.crossOrigin = "Anonymous";
    img.src = data.image_url;
  }, []);

  return (
    <div id={`post-${data.feed_id}`} className="ind-post">
      <Link to={`/${data.username}`} className="post-header">
        <div className="image-container">
          <img
            src={data.user_url || logo}
            alt={`${data.display_name}'s Profile`}
          />
        </div>
        <div className="content-container">
          <p>{data.display_name}</p>
          <div className="meta">
            <p>@{data.username}</p>
            <p>
              <span>
                <VscCircleFilled />
              </span>{" "}
              {moment(data.created_at).fromNow()}
            </p>
          </div>
        </div>
      </Link>
      <div className="post-content">
        <p>{data.vibe}</p>
      </div>
      <div
        className={`post-song ${
          audioUrl && audioUrl === data.preview_url ? "focus" : ""
        }`}
        onClick={() => playSong(data)}
      >
        <div className="image-container">
          <img src={data.image_url || logo} alt={data.name} />
          {audioUrl && audioUrl === data.preview_url ? <FaPause /> : <FaPlay />}
        </div>
        <div className="content-container">
          <p>{data.name}</p>
          <div className="meta">
            <p>
              {data.artists
                .map((item) => item.name)
                .slice(0, 3)
                .join(", ")}
            </p>
          </div>
        </div>
      </div>
      <div className="post-socials">
        <button onClick={() => likePost(data.feed_id)}>
          {userId && data.likes.includes(userId) ? <FaHeart /> : <FaRegHeart />}
          <span>{data.likes.length}</span>
        </button>
        <Link to={`/feed/${data.feed_id}`}>
          <FaRegComment /> <span>{data.total_comments}</span>
        </Link>
        <button onClick={edit ? () => deletePost(data.feed_id) : () => {}}>
          {edit ? <MdDelete /> : <FiUpload />}
        </button>
      </div>
    </div>
  );
};

export default Post;
