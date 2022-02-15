import { useState } from "react";
import { useSocket } from "../../context/socketContext";
import AddSongModal from "./AddItemModal";

const SendASong = ({ user }) => {
  const [click, setClick] = useState(false);
  const socketContext = useSocket();

  const sendSong = (song) => {
    socketContext.socket?.emit("sendasong", {
      to_id: user.user_id,
      content: song,
    });
    setClick(false);
  };

  return (
    <>
      {user.username !== localStorage.getItem("handle") && (
        <div className="send-song-button-container">
          <button
            onClick={() => {
              setClick(true);
            }}
          >
            Send a Song
          </button>
        </div>
      )}
      {click && (
        <AddSongModal
          submitData={sendSong}
          title="Send Request"
          type="track"
          close={() => setClick(false)}
        />
      )}
    </>
  );
};

export default SendASong;
