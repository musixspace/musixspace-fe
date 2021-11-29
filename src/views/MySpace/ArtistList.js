import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { AiFillCaretRight, AiOutlinePause } from "react-icons/ai";
import { FiSkipBack, FiSkipForward } from "react-icons/fi";
import { MdAdd, MdDelete } from "react-icons/md";
import logo from "../../assets/images/logo-black.png";
import Skeleton from "../../components/Skeleton";
import { paddedNumbers } from "../../util/functions";

const ArtistList = ({
  data,
  currentSong,
  songNumber,
  onLeftClicked,
  onRightClicked,
  handlePause,
  handleSetAndPlayArtist,
  edit,
}) => {
  const [name, setName] = useState("");
  const [artists, setArtists] = useState(null);

  useEffect(() => {
    if (edit) {
      setName(data.nickname);
      setArtists(data.artists);
    }
  }, [edit]);

  const onDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) return;
    if (destination.index === source.index) return;

    const sourceTrack = artists[source.index];

    const newArtists = [...artists];
    newArtists.splice(source.index, 1);
    newArtists.splice(destination.index, 0, sourceTrack);
    setArtists(newArtists);
  };

  const onDeleteArtist = (artistId) => {
    const newArtists = artists.filter((item) => item.artist_id !== artistId);
    setArtists(newArtists);
  };

  return (
    <div className="topArtists">
      <div className="upper-container">
        {edit ? (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        ) : (
          <p className="title">{data && data.nickname}</p>
        )}
      </div>
      <div className="genres-container">
        {!data ? (
          <>
            <Skeleton type="text" />
            <Skeleton type="text" />
            <Skeleton type="text" />
          </>
        ) : (
          !edit &&
          data.nickname &&
          currentSong.genre &&
          currentSong.genre.length > 0 &&
          currentSong.genre.map((genre) => (
            <div key={genre} className="genre">
              {genre}
            </div>
          ))
        )}
      </div>
      <div className="songs-container">
        <button
          className="prev"
          onClick={() =>
            onLeftClicked(".topArtists > .songs-container > .tracks-container")
          }
        >
          <FiSkipBack />
        </button>
        {edit ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable
              droppableId="artist-list-droppable"
              direction="horizontal"
            >
              {(provided) => (
                <div
                  className="tracks-container"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {artists && (
                    <>
                      <div className="track">
                        <div className="image-container">
                          <img src={logo} alt="Musixspace Logo" />
                        </div>
                        <div className="content-container">
                          <div className="title">Add New Artist</div>
                        </div>
                        <button className="controls" onClick={() => {}}>
                          <MdAdd />
                        </button>
                      </div>
                      {artists.map((item, idx) => (
                        <Draggable
                          key={item.artist_id}
                          draggableId={item.artist_id}
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
                              </div>
                              <button
                                className="controls"
                                onClick={() => onDeleteArtist(item.artist_id)}
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
                    <div className="image-container">
                      <Skeleton type="circle" />
                    </div>
                    <div className="content-container">
                      <Skeleton type="text" />
                    </div>
                  </div>
                ))
              : data.artists.map((item, idx) => (
                  <div key={idx} id={item.artist_id} className="track">
                    <div
                      className={`image-container ${
                        item.artist_id === currentSong.songId ? "selected" : ""
                      }`}
                    >
                      <img src={item.image_url || logo} alt={item.name} />
                    </div>
                    <div className="content-container">
                      <div className="title">{item.name}</div>
                    </div>
                    {item.toptrack && item.toptrack.preview_url && (
                      <button
                        className="controls"
                        onClick={() =>
                          item.artist_id === currentSong.songId
                            ? handlePause()
                            : handleSetAndPlayArtist(item, idx + 1)
                        }
                      >
                        {item.artist_id === currentSong.songId ? (
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
        <button
          className="next"
          onClick={() =>
            onRightClicked(".topArtists > .songs-container > .tracks-container")
          }
        >
          <FiSkipForward />
        </button>
      </div>
      {!data ? (
        <div className="metadata-container">
          <Skeleton type="text" />
          <Skeleton type="text" />
        </div>
      ) : (
        !edit &&
        data.artists.length > 0 && (
          <div className="metadata-container">
            <div className="dots-container">
              <div
                className={`dot ${
                  songNumber <= parseInt(data.artists.length / 3)
                    ? "highlight"
                    : ""
                }`}
              ></div>
              <div
                className={`dot ${
                  songNumber > data.artists.length / 3 &&
                  songNumber <= parseInt(2 * data.artists.length) / 3
                    ? "highlight"
                    : ""
                }`}
              ></div>
              <div
                className={`dot ${
                  songNumber > parseInt(2 * data.artists.length) / 3 &&
                  songNumber <= data.artists.length
                    ? "highlight"
                    : ""
                }`}
              ></div>
            </div>
            <div className="song-number">
              <span>{`${paddedNumbers(songNumber)}`}</span>
              <span>{`/${data.artists.length}`}</span>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default ArtistList;
