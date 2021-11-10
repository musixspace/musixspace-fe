import React, { useState } from "react";
import { IoMdCheckmark, IoMdClose } from "react-icons/io";

const ExportPlaylistModal = ({ submitData, close }) => {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    submitData(name.trim());
  };

  return (
    <div className="modal-wrapper">
      <div className="modal-container">
        <div className="close">
          <IoMdClose onClick={close} />
        </div>
        <form className="modal" onSubmit={handleSubmit}>
          <div id={`question#1`} className={`question-div`}>
            <div className="question">
              {/* <span>Q.</span> */}
              <span>What should we name your playlist? *</span>
            </div>
            <div className="answer">
              <input
                type="text"
                placeholder={`Enter playlist name`}
                value={name}
                autoComplete="none"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <button type="submit" className={!name ? "hide" : ""}>
              <span>Submit</span>
              <span>
                <IoMdCheckmark />
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExportPlaylistModal;
