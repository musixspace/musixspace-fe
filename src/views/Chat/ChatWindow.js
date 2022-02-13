import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { useSocket } from "../../context/socketContext";
import { userState } from "../../recoil/userAtom";
import { axiosInstance } from "../../util/axiosConfig";

import { FaSmile } from "react-icons/fa";
import { BsMusicNoteList } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import AddSongModal from "../MySpace/AddItemModal";

const ChatWindow = ({ selectedChat }) => {
  const [messages, setMessages] = useState([]);
  const [pageId, setPageId] = useState(0);
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);

  const { chat_id, participants } = selectedChat;
  const user = useRecoilValue(userState);
  const { userId } = user;

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const to_id = participants.find((participant) => participant !== userId); // need to extract userId here

  const socketContext = useSocket();

  useEffect(() => {
    if (socketContext.socket) {
      socketContext.socket.on("recv_msg", (res) => {
        console.log(res);
        setMessages((prev) => [...prev, res]);
      });
    }
  }, [socketContext.socket]);

  useEffect(() => {
    (async () => {
      if (chat_id) {
        const resp = await axiosInstance.get(
          `/chat/messages/${chat_id}/${pageId}`
        );
        console.log(resp);
        setMessages(resp.data);
      }
    })();
  }, [chat_id]);

  const sendMessage = () => {
    if (socketContext.socket) {
      socketContext.socket.emit("send_msg", {
        msg: { timestamp: Date.now(), content: value, to_id, type: "text" },
        chatId: chat_id,
      });
    }
  };

  const sendSong = (song) => {
    console.log("Send song", song);
  };

  const onEmojiClick = () => {};
  return (
    <div className="chattyWrapper">
      <div className="chatHeader">
        <div className="imageContainer">
          <img src={selectedChat.otherUser.image_url} className="userImg" />
        </div>
        <p>{selectedChat.otherUser.display_name}</p>
      </div>
      {/* {messages.map((msg) => (
        <div key={msg.message_id}>{JSON.stringify(msg.content)}</div>
      ))} */}
      <div className="chatsMain"></div>
      <div className="inputBar">
        <div className="iconContainer">
          <button
            onClick={() => {
              setShowEmojiPicker((prev) => !prev);
            }}
            className="emojiBtn"
          >
            <FaSmile size={20} />
          </button>
        </div>
        <div className="iconContainer">
          <button
            onClick={() => {
              setOpen(true);
            }}
            className="audioBtn"
          >
            <BsMusicNoteList size={20} />
          </button>
        </div>
        <form className="inputContainer">
          <input
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            placeholder="Type your message"
            className="inputMsg"
          />
          <button className="sendMsgBtn" onClick={sendMessage}>
            <IoMdSend size={24} />
          </button>
        </form>
      </div>
      {open && (
        <AddSongModal
          submitData={sendSong}
          title="Send A Song"
          type="track"
          close={() => setOpen(false)}
        />
      )}
    </div>
  );
};
export default ChatWindow;
