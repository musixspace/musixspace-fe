import { useEffect, useRef, useState } from "react";
import {
  AiFillCaretRight,
  AiFillStepBackward,
  AiFillStepForward,
  AiOutlinePause,
} from "react-icons/ai";
import { IoIosShuffle } from "react-icons/io";

const WebPlayer = ({ url, prevPlay, nextPlay, shufflePlay, noControls }) => {
  const audioPlayer = useRef();
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioPlayer.current.pause();
    } else {
      audioPlayer.current.play();
    }
    setIsPlaying((prev) => !prev);
  };

  useEffect(() => {
    if (url) {
      audioPlayer.current.play();
      setIsPlaying(true);
    }
  }, [url]);

  return (
    <div className="audio-container">
      <audio
        ref={audioPlayer}
        src={`${url}.mp3`}
        preload="metadata"
        onEnded={nextPlay}
      />
      {!noControls && (
        <div className="controls">
          <button onClick={prevPlay}>
            <AiFillStepBackward />
          </button>
          <button onClick={togglePlayPause}>
            {isPlaying ? <AiOutlinePause /> : <AiFillCaretRight />}
          </button>
          <button onClick={nextPlay}>
            <AiFillStepForward />
          </button>
          <button onClick={shufflePlay}>
            <IoIosShuffle />
          </button>
        </div>
      )}
    </div>
  );
};

export default WebPlayer;
