import { useEffect, useRef, useState } from "react";
import {
  AiFillCaretRight,
  AiOutlinePause,
  AiFillStepForward,
  AiFillStepBackward,
} from "react-icons/ai";
import "./WebPlayer.css";

const WebPlayer = ({ url, prevPlay, nextPlay }) => {
  const audioPlayer = useRef();
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    const ip = isPlaying;
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
      <audio ref={audioPlayer} src={`${url}.mp3`} preload="metadata" />
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
      </div>
    </div>
  );
};

export default WebPlayer;
