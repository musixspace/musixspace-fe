import React, { useEffect, useState } from "react";
import { AiFillCaretRight } from "react-icons/ai";
import { FiSkipBack, FiSkipForward } from "react-icons/fi";
import logo from "../../assets/images/logo-black.png";
import Skeleton from "../../components/Skeleton";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { MdAdd, MdDelete } from "react-icons/md";

const Playlist = ({
  data,
  onLeftClicked,
  onRightClicked,
  openPlaylistModal,
  edit,
  editData,
  setEditData,
}) => {
  const onDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) return;
    if (destination.index === source.index) return;

    const sourceTrack = editData.playlists.playlist_ids[source.index];

    const newPlaylists = [...editData.playlists.playlist_ids];
    newPlaylists.splice(source.index, 1);
    newPlaylists.splice(destination.index, 0, sourceTrack);
    // setPlaylists(newPlaylists);
    setEditData({
      ...editData,
      playlists: { ...editData.playlists, playlist_ids: newPlaylists },
    });
  };

  const onDeletePlaylist = (playlistId) => {
    const newPlaylists = editData.playlists.playlist_ids.filter(
      (item) => item.playlist_id !== playlistId
    );
    // setPlaylists(newPlaylists);
    setEditData({
      ...editData,
      playlists: { ...editData.playlists, playlist_ids: newPlaylists },
    });
  };

  return (
    <div className="topTracks">
      <div className="upper-container">
        {edit ? (
          <input
            type="text"
            value={editData.playlists.nickname}
            onChange={(e) =>
              setEditData({
                ...editData,
                playlists: { ...editData.playlists, nickname: e.target.value },
              })
            }
          />
        ) : (
          <p className="title">{data && data.nickname}</p>
        )}
      </div>
      <div className="songs-container playlist-container">
        <button
          className="prev"
          onClick={() =>
            onLeftClicked(
              ".topTracks > .playlist-container > .tracks-container"
            )
          }
        >
          <FiSkipBack />
        </button>
        {edit ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="play-list-droppable" direction="horizontal">
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
                          <div className="title">Add New Playlist</div>
                        </div>
                        <button className="controls" onClick={() => {}}>
                          <MdAdd />
                        </button>
                      </div>
                      {editData.playlists.playlist_ids.map((item, idx) => (
                        <Draggable
                          key={item.playlist_id}
                          draggableId={item.playlist_id}
                          index={idx}
                        >
                          {(provided) => (
                            <div
                              className="track"
                              ref={provided.innerRef}
                              {...provided.dragHandleProps}
                              {...provided.draggableProps}
                            >
                              <div className={`image-container`}>
                                <img
                                  src={item.cover_image || logo}
                                  alt={item.nickname}
                                />
                              </div>
                              <div className="content-container">
                                <div className="title">{item.nickname}</div>
                              </div>
                              <button
                                className="controls"
                                onClick={() =>
                                  onDeletePlaylist(item.playlist_id)
                                }
                              >
                                <MdDelete />
                              </button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </>
                  )}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <div className="tracks-container">
            {!data.playlist_ids
              ? [1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="track">
                    <Skeleton type="text" />
                  </div>
                ))
              : data.playlist_ids.map((item, idx) => (
                  <div
                    key={item.playlist_id}
                    id={item.playlist_id}
                    className="track"
                  >
                    <div className={`image-container`}>
                      <img src={item.cover_image || logo} alt={item.nickname} />
                    </div>
                    <div className="content-container">
                      <div className="title">{item.nickname}</div>
                    </div>
                    <a
                      href={`https://open.spotify.com/playlist/${item.playlist_id}`}
                      target="_blank"
                    >
                      Follow
                    </a>
                    <button
                      className="controls"
                      onClick={() => openPlaylistModal(item)}
                    >
                      <AiFillCaretRight />
                    </button>
                  </div>
                ))}
          </div>
        )}
        <button
          className="next"
          onClick={() =>
            onRightClicked(
              ".topTracks > .playlist-container > .tracks-container"
            )
          }
        >
          <FiSkipForward />
        </button>
      </div>
    </div>
  );
};

export default Playlist;
