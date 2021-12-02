import React, { useEffect, useState } from "react";
import {
  AiFillCaretRight,
  AiOutlinePause,
  AiOutlineUpload,
} from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import logo from "../../assets/images/logo-black.png";
import Skeleton from "../../components/Skeleton";
import AddSongModal from "./AddSongModal";

const Intro = ({
  user,
  currentSong,
  handlePause,
  handlePlaySong,
  edit,
  editData,
  setEditData,
}) => {
  const [openModal, setOpenModal] = useState(false);

  const submitFile = (file) => {
    console.log(file);
  };

  const changeAnthem = (data) => {
    setEditData({
      ...editData,
      currentUser: {
        ...editData.currentUser,
        anthem: {
          ...editData.currentUser.anthem,
          name: data.name,
          artists: "",
          song_id: data.id,
          image_url: data.image_url,
          preview_url: null,
        },
      },
    });
    setOpenModal(false);
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
                    value={editData.currentUser.display_name}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        currentUser: {
                          ...editData.currentUser,
                          display_name: e.target.value,
                        },
                      })
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
        {edit ? (
          <div className="anthem-container">
            <div className="content">
              <div>{`${
                editData.currentUser.display_name.split(" ")[0]
              }'s Anthem`}</div>
              <p>{editData.currentUser.anthem.name}</p>
              <p>
                {editData.currentUser.anthem.artists.length > 0 &&
                  editData.currentUser.anthem.artists
                    .map((item) => item.name)
                    .join(", ")}
              </p>
            </div>
            <div className="image-container">
              <img
                src={editData.currentUser.anthem.image_url}
                alt={`${
                  editData.currentUser.display_name.split(" ")[0]
                }'s Anthem'`}
              />
              <button onClick={() => setOpenModal(true)}>
                <MdDelete />
              </button>
            </div>
          </div>
        ) : (
          <div className="anthem-container">
            <div className="content">
              {user && user.display_name ? (
                <>
                  <div>{`${user.display_name.split(" ")[0]}'s Anthem`}</div>
                  <p>{user.anthem.name}</p>
                  <p>
                    {user.anthem.artists.map((item) => item.name).join(", ")}
                  </p>
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
                  {edit ? (
                    <button onClick={() => setOpenModal(true)}>
                      <MdDelete />
                    </button>
                  ) : (
                    user.anthem.preview_url && (
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
                    )
                  )}
                </>
              ) : (
                <Skeleton type="text" />
              )}
            </div>
          </div>
        )}
      </div>
      {openModal && (
        <AddSongModal
          submitData={changeAnthem}
          title="Change Anthem"
          close={() => setOpenModal(false)}
        />
      )}
    </div>
  );
};

export default Intro;
