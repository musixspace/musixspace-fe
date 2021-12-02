import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { AiFillCaretRight, AiOutlinePause } from "react-icons/ai";
import { FiSkipBack, FiSkipForward } from "react-icons/fi";
import { MdAdd, MdDelete } from "react-icons/md";
import { useSetRecoilState } from "recoil";
import logo from "../../assets/images/logo-black.png";
import Skeleton from "../../components/Skeleton";
import { alertAtom } from "../../recoil/alertAtom";
import { paddedNumbers } from "../../util/functions";
import AddSongModal from "./AddSongModal";

const TrackList = ({
  data,
  currentSong,
  songNumber,
  handlePause,
  handleSetAndPlayTrack,
  onLeftClicked,
  onRightClicked,
  edit,
  editData,
  setEditData,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const setAlert = useSetRecoilState(alertAtom);

  const onDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) return;
    if (destination.index === source.index) return;

    const sourceTrack = editData.tracks.songs[source.index];

    const newTracks = [...editData.tracks.songs];
    newTracks.splice(source.index, 1);
    newTracks.splice(destination.index, 0, sourceTrack);
    // setTracks(newTracks);
    setEditData({
      ...editData,
      tracks: { ...editData.tracks, songs: newTracks },
    });
  };

  const onDeleteTrack = (songId) => {
    const newTracks = editData.tracks.songs.filter(
      (item) => item.song_id !== songId
    );
    // setTracks(newTracks);
    setEditData({
      ...editData,
      tracks: { ...editData.tracks, songs: newTracks },
    });
  };

  const addNewTrack = (track) => {
    console.log(track);
    const duplicateTrack = editData.tracks.songs.find((item) =>
      item ? item.song_id === track.id : false
    );
    if (duplicateTrack) {
      setAlert({
        open: true,
        message: `You already have this track in your current playlist!`,
        type: "warning",
      });
    } else {
      const newTrack = {
        song_id: track.id,
        name: track.name,
        image_url: track.image_url,
      };
      setEditData({
        ...editData,
        tracks: {
          ...editData.tracks,
          songs: [newTrack, ...editData.tracks.songs],
        },
      });
      setOpenModal(false);
    }
  };

  return (
    <div className="topTracks">
      <div className="upper-container">
        {edit ? (
          <input
            type="text"
            value={editData.tracks.nickname}
            onChange={(e) =>
              setEditData({
                ...editData,
                tracks: { ...editData.tracks, nickname: e.target.value },
              })
            }
          />
        ) : (
          <p className="title">{data && data.nickname}</p>
        )}
      </div>
      <div className="songs-container">
        {data && (
          <button
            className="prev"
            onClick={() =>
              onLeftClicked(".topTracks > .songs-container > .tracks-container")
            }
          >
            <FiSkipBack />
          </button>
        )}
        {edit ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable
              droppableId="track-list-droppable"
              direction="horizontal"
            >
              {(provided) => (
                <div
                  className="tracks-container"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {data && data.nickname && (
                    <>
                      <div className="track">
                        <div className="image-container">
                          <img src={logo} alt="Musixspace Logo" />
                        </div>
                        <div className="content-container">
                          <div className="title">Add New Track</div>
                        </div>
                        <button
                          className="controls"
                          onClick={() => setOpenModal(true)}
                        >
                          <MdAdd />
                        </button>
                      </div>
                      {editData.tracks.songs.map(
                        (item, idx) =>
                          item && (
                            <Draggable
                              key={item.song_id}
                              draggableId={item.song_id}
                              index={idx}
                            >
                              {(provided) => (
                                <div
                                  className="track"
                                  ref={provided.innerRef}
                                  {...provided.dragHandleProps}
                                  {...provided.draggableProps}
                                >
                                  <div className="image-container">
                                    <img
                                      src={item.image_url || logo}
                                      alt={item.name}
                                    />
                                  </div>
                                  <div className="content-container">
                                    <div className="title">{item.name}</div>
                                    <div className="sub">
                                      {item.artists &&
                                        item.artists.length > 0 &&
                                        item.artists
                                          .map((i) => i.name)
                                          .join(", ")}
                                    </div>
                                  </div>
                                  <button
                                    className="controls"
                                    onClick={() => onDeleteTrack(item.song_id)}
                                  >
                                    <MdDelete />
                                  </button>
                                </div>
                              )}
                            </Draggable>
                          )
                      )}
                    </>
                  )}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <div className="tracks-container">
            {!data
              ? [1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="track">
                    <Skeleton type="text" />
                  </div>
                ))
              : data.songs &&
                data.songs.length > 0 &&
                data.songs.map(
                  (item, idx) =>
                    item && (
                      <div
                        key={item.song_id}
                        id={item.song_id}
                        className="track"
                      >
                        <div
                          className={`image-container ${
                            item.song_id === currentSong.songId
                              ? "selected"
                              : ""
                          }`}
                        >
                          <img src={item.image_url || logo} alt={item.name} />
                        </div>
                        <div className="content-container">
                          <div className="title">{item.name}</div>
                          <div className="sub">
                            {item.artists &&
                              item.artists.length > 0 &&
                              item.artists.map((i) => i.name).join(", ")}
                          </div>
                        </div>
                        {item.preview_url && (
                          <button
                            className="controls"
                            onClick={() =>
                              item.song_id === currentSong.songId
                                ? handlePause()
                                : handleSetAndPlayTrack(
                                    item.song_id,
                                    item.preview_url,
                                    idx + 1
                                  )
                            }
                          >
                            {item.song_id === currentSong.songId ? (
                              <AiOutlinePause />
                            ) : (
                              <AiFillCaretRight />
                            )}
                          </button>
                        )}
                      </div>
                    )
                )}
          </div>
        )}
        {data && (
          <button
            className="next"
            onClick={() =>
              onRightClicked(
                ".topTracks > .songs-container > .tracks-container"
              )
            }
          >
            <FiSkipForward />
          </button>
        )}
      </div>
      {!data ? (
        <div className="metadata-container">
          <Skeleton type="text" />
          <Skeleton type="text" />
        </div>
      ) : (
        data &&
        data.songs &&
        data.songs.length > 0 &&
        !edit && (
          <div className="metadata-container">
            <div className="dots-container">
              <div
                className={`dot ${
                  songNumber <= parseInt(data.songs.length / 3)
                    ? "highlight"
                    : ""
                }`}
              ></div>
              <div
                className={`dot ${
                  songNumber > parseInt(data.songs.length / 3) &&
                  songNumber <= parseInt((2 * data.songs.length) / 3)
                    ? "highlight"
                    : ""
                }`}
              ></div>
              <div
                className={`dot ${
                  songNumber > parseInt((2 * data.songs.length) / 3) &&
                  songNumber <= data.songs.length
                    ? "highlight"
                    : ""
                }`}
              ></div>
            </div>
            <div className="song-number">
              <span>{`${paddedNumbers(songNumber)}`}</span>
              <span>{`/${data.songs && data.songs.length}`}</span>
            </div>
          </div>
        )
      )}
      {openModal && (
        <AddSongModal
          submitData={addNewTrack}
          title="Add New Track"
          close={() => setOpenModal(false)}
        />
      )}
    </div>
  );
};

export default TrackList;
