import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { AiFillCaretRight, AiOutlinePause } from "react-icons/ai";
import { FiSkipBack, FiSkipForward } from "react-icons/fi";
import { MdAdd, MdDelete } from "react-icons/md";
import logo from "../../assets/images/logo-black.png";
import Skeleton from "../../components/Skeleton";
import { paddedNumbers } from "../../util/functions";

const TrackList = ({
  data,
  currentSong,
  songNumber,
  handlePause,
  handleSetAndPlayTrack,
  onLeftClicked,
  onRightClicked,
  edit,
}) => {
  const [name, setName] = useState("");
  const [tracks, setTracks] = useState(null);

  useEffect(() => {
    if (edit) {
      setName("Top Tracks");
      setTracks(data);
    }
  }, [edit]);

  const onDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) return;
    if (destination.index === source.index) return;

    const sourceTrack = tracks[source.index];

    const newTracks = [...tracks];
    newTracks.splice(source.index, 1);
    newTracks.splice(destination.index, 0, sourceTrack);
    setTracks(newTracks);
  };

  const onDeleteTrack = (songId) => {
    const newTracks = tracks.filter((item) => item.song_id !== songId);
    setTracks(newTracks);
  };

  return (
    <div className="topTracks">
      <div className="upper-container">
        {edit ? (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        ) : (
          <p className="title">Top Tracks</p>
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
                  {tracks && (
                    <>
                      <div className="track">
                        <div className="image-container">
                          <img src={logo} alt="Musixspace Logo" />
                        </div>
                        <div className="content-container">
                          <div className="title">Add New Track</div>
                        </div>
                        <button className="controls" onClick={() => {}}>
                          <MdAdd />
                        </button>
                      </div>
                      {tracks.map((item, idx) => (
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
                                  {item.artists.map((i) => i.name).join(", ")}
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
                      ))}
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
              : data.map((item, idx) => (
                  <div key={item.song_id} id={item.song_id} className="track">
                    <div
                      className={`image-container ${
                        item.song_id === currentSong.songId ? "selected" : ""
                      }`}
                    >
                      <img src={item.image_url || logo} alt={item.name} />
                    </div>
                    <div className="content-container">
                      <div className="title">{item.name}</div>
                      <div className="sub">
                        {item.artists.map((i) => i.name).join(", ")}
                      </div>
                    </div>
                    {item.preview_url && (
                      <button
                        className="controls"
                        onClick={() =>
                          item.song_id === currentSong.songId
                            ? handlePause()
                            : handleSetAndPlayTrack(
                                idx + 1,
                                item.song_id,
                                item.preview_url
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
                ))}
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
        data.length > 0 &&
        !edit && (
          <div className="metadata-container">
            <div className="dots-container">
              <div
                className={`dot ${
                  songNumber <= parseInt(data.length / 3) ? "highlight" : ""
                }`}
              ></div>
              <div
                className={`dot ${
                  songNumber > parseInt(data.length / 3) &&
                  songNumber <= parseInt((2 * data.length) / 3)
                    ? "highlight"
                    : ""
                }`}
              ></div>
              <div
                className={`dot ${
                  songNumber > parseInt((2 * data.length) / 3) &&
                  songNumber <= data.length
                    ? "highlight"
                    : ""
                }`}
              ></div>
            </div>
            <div className="song-number">
              <span>{`${paddedNumbers(songNumber)}`}</span>
              <span>{`/${data && data.length}`}</span>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default TrackList;
