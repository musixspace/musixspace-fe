import React, { useRef, useState } from "react";
import {
  AiFillCaretRight,
  AiOutlinePause,
  AiOutlineUpload,
} from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import logo from "../../assets/images/logo-black.png";
import Skeleton from "../../components/Skeleton";
import AddSongModal from "./AddItemModal";
import S3 from "react-aws-s3";
import { generateRandomString } from "../../util/functions";
import { alertAtom } from "../../recoil/alertAtom";
import { useSetRecoilState } from "recoil";
import { useHistory } from "react-router-dom";
import SendASong from "./SendASong";

const Intro = ({
  user,
  currentSong,
  handlePause,
  handlePlaySong,
  edit,
  editData,
  setEditData,
}) => {
  const history = useHistory();
  const setAlert = useSetRecoilState(alertAtom);
  const [openModal, setOpenModal] = useState(false);
  const fileInput = useRef("");

  const handleUpload = (e) => {
    e.preventDefault();
    let file = fileInput.current.files[0];
    let fileName = `${localStorage.getItem(
      "handle",
    )}-profile-${generateRandomString(5)}`;
    const config = {
      bucketName: "musixspace",
      dirName: "users",
      region: "us-east-2",
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_SECRET_ACCESS_KEY,
    };

    setAlert({
      open: true,
      message: `Uploading image...`,
      type: "info",
    });

    const ReactS3Client = new S3(config);
    ReactS3Client.uploadFile(file, fileName).then((data) => {
      if (data.status === 204) {
        console.log(data);
        setEditData({
          ...editData,
          currentUser: { ...editData.currentUser, image_url: data.location },
        });
      } else {
        setAlert({
          open: true,
          message: `Some error occurred while uploading image!`,
          type: "error",
        });
      }
    });
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

  const gotToMatch = (e) => {
    e.preventDefault();
    history.push(`/match/${user.username}`);
  };

  return (
    <div className="intro">
      <div className="image-container">
        {user && user.display_name ? (
          <>
            <img
              src={
                edit
                  ? editData.currentUser.image_url || logo
                  : user.image_url || logo
              }
              alt={`${user.display_name.split(" ")[0]}'s Image'`}
            />
            <SendASong user={user} />
            {edit && (
              <div className="uploadContainer">
                <input
                  type="file"
                  accept=".jpg,.png,.jpeg"
                  ref={fileInput}
                  onChange={handleUpload}
                />
                <div className="uploadContent">
                  <AiOutlineUpload />
                  <span>Upload Image</span>
                </div>
              </div>
            )}
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
                  <button onClick={gotToMatch}>Match</button>
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
                                null,
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
          type="track"
          close={() => setOpenModal(false)}
        />
      )}
    </div>
  );
};

export default Intro;
