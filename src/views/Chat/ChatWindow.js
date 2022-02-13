import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { useSocket } from "../../context/socketContext";
import { userState } from "../../recoil/userAtom";
import { axiosInstance } from "../../util/axiosConfig";

import { FaSmile } from "react-icons/fa";
import { BsMusicNoteList } from "react-icons/bs";
import { GrSend } from "react-icons/gr";

const ChatWindow = ({ selectedChat }) => {
  const [messages, setMessages] = useState([]);
  const [pageId, setPageId] = useState(0);
  const [value, setValue] = useState("");
  const { chat_id, participants } = selectedChat;
  const user = useRecoilValue(userState);
  console.log(user.userId);
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
          `/chat/messages/${chat_id}/${pageId}`,
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
        <div className="emojiContainer">
          <button
            onClick={() => {
              setShowEmojiPicker((prev) => !prev);
            }}
            className="emojiBtn"
          >
            <FaSmile />
          </button>
        </div>
        <div className="audioContainer">
          <button
            onClick={() => {
              setShowEmojiPicker((prev) => !prev);
            }}
            className="audioBtn"
          >
            <BsMusicNoteList />
          </button>
        </div>
        <div className="inputContainer">
          <input
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            placeholder="Type your message"
            className="inputMsg"
          />
        </div>
        <button className="sendMsgBtn" onClick={sendMessage}>
          <GrSend />
        </button>
      </div>
    </div>
  );
};
export default ChatWindow;
