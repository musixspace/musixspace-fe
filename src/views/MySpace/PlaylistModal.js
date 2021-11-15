import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { paddedNumbers, setMediaSession } from "../../util/functions";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import WebPlayer from "../../components/WebPlayer";
import { AiFillCaretRight, AiOutlinePause } from "react-icons/ai";

const PlaylistModal = ({ data, close, isEdit }) => {
  const [tracks, setTracks] = useState(data.songs);
  const [currentSong, setCurrentSong] = useState({
    songId: null,
    audioUrl: null,
  });

  useEffect(() => {
    if (currentSong.songId && !currentSong.audioUrl) {
      handleNextPlay();
    } else if (currentSong.audioUrl) {
      const currTrack = tracks.find(
        (item) => item.song_id === currentSong.songId
      );
      const artists = currTrack.artists.map((i) => i.name).join(", ");
      setMediaSession(
        currTrack.name,
        artists,
        currTrack.image_url,
        null,
        handleNextPlay
      );
    }
  }, [currentSong.audioUrl]);

  useEffect(() => {
    if (currentSong.songId) {
      const container = document.querySelector(".edit-list");
      let children = container.children;
      let index = 0;
      while (!children[index].classList.contains("selected")) {
        index++;
      }
      // console.log(index);
      if (index) {
        children = container.querySelector(
          `.track:nth-child(${index})`
        ).offsetTop;
        container.scrollTo({ top: children - 50, behavior: "smooth" });
      } else {
        container.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [currentSong.songId]);

  const handlePlaySong = (songId, audioUrl) => {
    setCurrentSong({ songId, audioUrl });
  };

  const handlePause = () => {
    setCurrentSong({ songId: null, audioUrl: null });
  };

  const handleNextPlay = () => {
    const currTrack = tracks.find(
      (item) => item.song_id === currentSong.songId
    );
    const index = tracks.indexOf(currTrack);

    if (index === tracks.length - 1) {
      setCurrentSong({
        songId: tracks[0].song_id,
        audioUrl: tracks[0].preview_url,
      });
    } else {
      setCurrentSong({
        songId: tracks[index + 1].song_id,
        audioUrl: tracks[index + 1].preview_url,
      });
    }
  };

  const onDragEnd = (result) => {
    // console.log(result);
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.index === source.index) return;

    const sourceTrack = tracks[source.index];

    const newTracks = [...tracks];
    newTracks.splice(source.index, 1);
    newTracks.splice(destination.index, 0, sourceTrack);
    setTracks(newTracks);
  };

  const onDeleteTrack = (id) => {
    const newTracks = tracks.filter((item) => item.song_id !== id);
    setTracks(newTracks);
  };

  return (
    <div className="modal-wrapper">
      <div className="modal-container">
        <div className="close">
          <IoMdClose onClick={close} />
        </div>
        <div className="modal edit-list-container">
          <div className="title">{data.name} Playlist</div>
          {isEdit ? (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="edit-list-droppable">
                {(provided) => (
                  <div
                    className="edit-list"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {tracks &&
                      tracks.length > 0 &&
                      tracks.map((item, ind) => (
                        <Draggable
                          key={item.song_id}
                          draggableId={item.song_id}
                          index={ind}
                        >
                          {(provided) => (
                            <div
                              className="track"
                              ref={provided.innerRef}
                              {...provided.dragHandleProps}
                              {...provided.draggableProps}
                            >
                              <div className="image-container">
                                <img src={item.image_url} alt={item.name} />
                              </div>
                              <div className="content-container">
                                <div className="main">
                                  <div className="title">{item.name}</div>
                                  <div className="sub">
                                    {item.artists.map((i) => i.name).join(", ")}
                                  </div>
                                </div>
                                <div className="num">
                                  <span>{`#${paddedNumbers(ind + 1)}`}</span>
                                  <span
                                    onClick={() => onDeleteTrack(item.song_id)}
                                  >
                                    <MdDelete />
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            <div className="edit-list">
              {tracks &&
                tracks.length > 0 &&
                tracks.map((item, ind) => (
                  <div
                    key={item.song_id}
                    className={`track ${
                      currentSong.songId === item.song_id ? "selected" : ""
                    } `}
                  >
                    <div className="image-container">
                      <img src={item.image_url} alt={item.name} />
                    </div>
                    <div className="content-container">
                      <div className="main">
                        <div className="title">{item.name}</div>
                        <div className="sub">
                          {item.artists.map((i) => i.name).join(", ")}
                        </div>
                      </div>
                      <div className="num">
                        <span>{`#${paddedNumbers(ind + 1)}`}</span>
                        {item.preview_url &&
                          (currentSong.songId === item.song_id ? (
                            <span onClick={() => handlePause()}>
                              <AiOutlinePause />
                            </span>
                          ) : (
                            <span
                              onClick={() =>
                                handlePlaySong(item.song_id, item.preview_url)
                              }
                            >
                              <AiFillCaretRight />
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
        {currentSong.audioUrl && (
          <WebPlayer
            url={currentSong.audioUrl}
            nextPlay={handleNextPlay}
            noControls={true}
          />
        )}
      </div>
    </div>
  );
};

export default PlaylistModal;
