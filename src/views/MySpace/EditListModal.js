import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { paddedNumbers } from "../../util/functions";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const EditListModal = ({ data, close }) => {
  const [tracks, setTracks] = useState(data);

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
        </div>
      </div>
    </div>
  );
};

export default EditListModal;
