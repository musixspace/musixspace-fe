import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { IoMdClose } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import WebPlayer from "../../components/WebPlayer";
import { paddedNumbers, setMediaSession } from "../../util/functions";
import logo from "../../assets/images/logo-black.png";

const PlaylistModal = ({ data, close, isEdit }) => {
  const [tracks, setTracks] = useState(data.songs);
  const [currentSong, setCurrentSong] = useState({
    songId: null,
    audioUrl: null,
    imageUrl: data.cover_image,
    name: "",
    artists: "",
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
        handlePrevPlay,
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
      if (index) {
        children = container.querySelector(
          `.track:nth-child(${index})`
        ).offsetTop;
        container.scrollTo({ top: children - 100, behavior: "smooth" });
      } else {
        container.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [currentSong.songId]);

  const handlePlaySong = (songId, audioUrl, imageUrl, name, artists) => {
    setCurrentSong({ songId, audioUrl, imageUrl, name, artists });
  };

  const handlePrevPlay = () => {
    const currTrack = tracks.find(
      (item) => item.song_id === currentSong.songId
    );
    const index = tracks.indexOf(currTrack);

    if (index === 0) {
      setCurrentSong({
        songId: tracks[tracks.length - 1].song_id,
        audioUrl: tracks[tracks.length - 1].preview_url,
        imageUrl: tracks[tracks.length - 1].image_url,
        name: tracks[tracks.length - 1].name,
        artists: tracks[tracks.length - 1].artists
          .map((i) => i.name)
          .join(", "),
      });
    } else {
      setCurrentSong({
        songId: tracks[index - 1].song_id,
        audioUrl: tracks[index - 1].preview_url,
        imageUrl: tracks[index - 1].image_url,
        name: tracks[index - 1].name,
        artists: tracks[index - 1].artists.map((i) => i.name).join(", "),
      });
    }
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
        imageUrl: tracks[0].image_url,
        name: tracks[0].name,
        artists: tracks[0].artists.map((i) => i.name).join(", "),
      });
    } else {
      setCurrentSong({
        songId: tracks[index + 1].song_id,
        audioUrl: tracks[index + 1].preview_url,
        imageUrl: tracks[index + 1].image_url,
        name: tracks[index + 1].name,
        artists: tracks[index + 1].artists.map((i) => i.name).join(", "),
      });
    }
  };

  const handleShufflePlay = () => {
    let total = tracks.length;
    let rnd = Math.floor(Math.random() * total);
    const newTrack = tracks[rnd];
    setCurrentSong({
      songId: newTrack.song_id,
      audioUrl: newTrack.preview_url,
      imageUrl: newTrack.image_url,
      name: newTrack.name,
      artists: newTrack.artists.map((i) => i.name).join(", "),
    });
  };

  const onDragEnd = (result) => {
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
    <div className="modal-wrapper playlist-modal-wrapper">
      <div className="modal-container">
        <div className="close">
          <IoMdClose onClick={close} />
        </div>
        <div className="modal edit-list-container">
          <div className="topbar">
            <div className="main">
              <span>{data.name}</span>
              <span>{`${
                data.songs.length > 1
                  ? `${data.songs.length} songs`
                  : data.songs.length === 0
                  ? "No song"
                  : "1 song"
              }`}</span>
            </div>
            <div className="button-container">
              <a
                href={`https://open.spotify.com/playlist/${data.playlist_id}`}
                target="_blank"
              >
                Follow
              </a>
            </div>
          </div>
          <div className="main-content">
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
                                  <img
                                    src={item.image_url || logo}
                                    alt={item.name}
                                  />
                                </div>
                                <div className="content-container">
                                  <div className="main">
                                    <div className="title">{item.name}</div>
                                    <div className="sub">
                                      {item.artists
                                        .map((i) => i.name)
                                        .join(", ")}
                                    </div>
                                  </div>
                                  <div className="num">
                                    <span>{`#${paddedNumbers(ind + 1)}`}</span>
                                    <span
                                      onClick={() =>
                                        onDeleteTrack(item.song_id)
                                      }
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
                      onClick={() =>
                        handlePlaySong(
                          item.song_id,
                          item.preview_url,
                          item.image_url,
                          item.name,
                          item.artists.map((i) => i.name).join(", ")
                        )
                      }
                    >
                      <div className="content-container">
                        <div className="main">
                          <div className="title">{item.name}</div>
                          <div className="sub">
                            {item.artists.map((i) => i.name).join(", ")}
                          </div>
                        </div>
                        <div className="num">
                          <span>{`#${paddedNumbers(ind + 1)}`}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
            <div className="image-controls">
              <div className="image-container">
                <img src={currentSong.imageUrl || logo} alt="Cover Image" />
              </div>
              {currentSong.audioUrl && (
                <div className="song-info">
                  <div className="song-name">{currentSong.name}</div>
                  <div className="song-artists">{currentSong.artists}</div>
                </div>
              )}
              {currentSong.audioUrl && (
                <WebPlayer
                  url={currentSong.audioUrl}
                  prevPlay={handlePrevPlay}
                  nextPlay={handleNextPlay}
                  shufflePlay={handleShufflePlay}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistModal;
