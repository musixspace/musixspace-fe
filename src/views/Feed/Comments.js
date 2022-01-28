import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { axiosInstance } from "../../util/axiosConfig";
import { nFormatter } from "../../util/functions";
import logo from "../../assets/images/logo-black.png";
import moment from "moment";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const Comments = ({ userId, feedId, totalComments, closeComments }) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [comments, setComments] = useState([]);

  const getCommentsAPICall = () => {
    axiosInstance
      .get(`/feed/allcomments/${feedId}/${pageIndex}`)
      .then((res) => {
        setComments([...comments, ...res.data]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getCommentsAPICall();
  }, [feedId, pageIndex]);

  const likeComment = (commentId) => {
    axiosInstance
      .put(`/feed/comment/${commentId}`)
      .then((res) => {
        const allComments = comments.map((item) => {
          if (item.comment_id === commentId) {
            if (item.likes.includes(userId)) {
              item.likes = item.likes.filter((i) => i !== userId);
            } else {
              item.likes.push(userId);
            }
          }
          return item;
        });
        setComments(allComments);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="comments-container" onClick={closeComments}>
      <div
        className="comments-wrapper"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="comment-header">
          <p>
            Comments <span>{nFormatter(totalComments)}</span>
          </p>
          <button onClick={closeComments}>
            <IoMdClose />
          </button>
        </div>
        <div className="comment-section">
          <div className="comment-input"></div>
          <div className="comment-list">
            {comments.map((_) => (
              <div className="comment" key={_.comment_id}>
                <div className="image-container">
                  <img
                    src={_.image_url || logo}
                    alt={`${_.display_name}'s Profile`}
                  />
                </div>
                <div className="content-container">
                  <div className="topbar">
                    <p>{_.display_name} </p>
                    <p>{moment(_.created_at).fromNow()}</p>
                  </div>
                  <p>{_.comment}</p>

                  <div
                    className="controls"
                    onClick={(e) => {
                      e.stopPropagation();
                      likeComment(_.comment_id);
                    }}
                  >
                    {userId && _.likes.includes(userId) ? (
                      <FaHeart />
                    ) : (
                      <FaRegHeart />
                    )}
                    <span>{nFormatter(_.likes.length)}</span>
                  </div>
                </div>
              </div>
            ))}
            {comments.length < totalComments ? (
              <button
                className="comment"
                id="load-more"
                onClick={() => setPageIndex((prev) => prev + 1)}
              >
                <p>Load More...</p>
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comments;
