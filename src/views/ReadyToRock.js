import React from "react";
import Navbar from "../components/Navbar";
import { GoMail, GoPencil } from "react-icons/go";
import { FaMusic } from "react-icons/fa";

const ReadyToRock = () => {
  return (
    <div className="wrapper">
      <Navbar />
      <div className="readyToRock">
        <div className="container">
          <div className="title">Ready to rock your space?</div>
          <div className="input-fields">
            <div>
              <GoMail />
              <input type="text" placeholder="Your rocking email" />
            </div>
            <div>
              <GoPencil />
              <input type="text" placeholder="A cool username" />
            </div>
            <div>
              <FaMusic />
              <input type="text" placeholder="Your Anthem" />
            </div>
          </div>
          <div className="button-div">
            <button>I'm Ready</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadyToRock;
