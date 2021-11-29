import React, { useEffect, useState } from "react";
import {
  AiFillCaretRight,
  AiOutlinePause,
  AiOutlineUpload,
} from "react-icons/ai";
import logo from "../../assets/images/logo-black.png";
import Skeleton from "../../components/Skeleton";

const Intro = ({ user, currentSong, handlePause, handlePlaySong, edit }) => {
  const [store, setStore] = useState({
    displayName: "",
    imageUrl: "",
    username: "",
    file: null,
  });

  useEffect(() => {
    if (user && user.display_name) {
      setStore({
        displayName: user.display_name,
        imageUrl: user.image_url || logo,
        username: user.username,
        file: null,
      });
    }
  }, [user]);

  const submitFile = (file) => {
    console.log(file);
  };

  return (
    <div className="intro">
      <div className="image-container">
        {user && user.display_name ? (
          <>
            <img
              src={user.image_url || logo}
              alt={`${user.display_name.split(" ")[0]}'s Image'`}
            />
            {/* {edit && (
              <div className="uploadContainer">
                <input
                  type="file"
                  accept=".jpg,.png,.jpeg"
                  onChange={(e) => setStore({ ...store, file: e.target.files })}
                />
                <div className="uploadContent">
                  <AiOutlineUpload />
                  <span>Upload Image</span>
                </div>
              </div>
            )} */}
          </>
        ) : (
          <Skeleton type="text" />
        )}
      </div>
      <div className="content-container">
        <div className="main">
          {user && user.display_name ? (
            <>
              <p>
                {edit ? (
                  <input
                    value={store.displayName}
                    onChange={(e) =>
                      setStore({ ...store, displayName: e.target.value })
                    }
                    type="text"
                  />
                ) : (
                  user.display_name
                )}
              </p>
              <div className="sub">
                <div className="traits-container">
                  {user.traits &&
                    user.traits.length > 0 &&
                    user.traits.map((trait) => (
                      <div key={trait} className="trait">
                        {trait}
                      </div>
                    ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <Skeleton type="text" />
              <Skeleton type="text" />
            </>
          )}
        </div>
        <div className="middle">
          {user && user.display_name ? (
            <>
              <p>{user.username}</p>
              {user.username !== localStorage.getItem("handle") && (
                <div className="button-container">
                  <button>Match</button>
                </div>
              )}
            </>
          ) : (
            <>
              <Skeleton type="text" />
              <Skeleton type="text" />
            </>
          )}
        </div>
        <div className="anthem-container">
          <div className="content">
            {user && user.display_name ? (
              <>
                <div>{`${user.display_name.split(" ")[0]}'s Anthem`}</div>
                <p>{user.anthem.name}</p>
                <p>{user.anthem.artists.map((item) => item.name).join(", ")}</p>
              </>
            ) : (
              <>
                <Skeleton type="text" />
                <Skeleton type="text" />
                <Skeleton type="text" />
              </>
            )}
          </div>
          <div
            className={`image-container ${
              user && user.anthem.song_id === currentSong.songId
                ? "highlight"
                : ""
            }`}
          >
            {user && user.display_name ? (
              <>
                <img
                  src={user.anthem.image_url || logo}
                  alt={`${user.display_name.split(" ")[0]}'s Anthem'`}
                />
                {user.anthem.preview_url && (
                  <button
                    onClick={() =>
                      user.anthem.song_id === currentSong.songId
                        ? handlePause()
                        : handlePlaySong(
                            user.anthem.song_id,
                            user.anthem.preview_url,
                            1,
                            null
                          )
                    }
                  >
                    {user.anthem.song_id === currentSong.songId ? (
                      <AiOutlinePause />
                    ) : (
                      <AiFillCaretRight />
                    )}
                  </button>
                )}
              </>
            ) : (
              <Skeleton type="text" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intro;
