import { useEffect, useState, useRef } from "react";
import { useRecoilValue } from "recoil";
import { useSocket } from "../../context/socketContext";
import { userState } from "../../recoil/userAtom";
import { axiosInstance } from "../../util/axiosConfig";
import { BsArrowLeftShort } from "react-icons/bs";
import moment from "moment";
import { FaSmile } from "react-icons/fa";
import { BsMusicNoteList } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import AddSongModal from "../MySpace/AddItemModal";
import Audio from "../../components/Audio";
import { useChat } from "../../context/chatContext";

const ChatWindow = ({ isDesktop, setShowChat }) => {
  const [messages, setMessages] = useState([]);
  const [pageId, setPageId] = useState(0);
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);

  const { selectedChat } = useChat();
  const { chat_id, participants } = selectedChat;
  const user = useRecoilValue(userState);
  const { userId } = user;

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const to_id = participants.find((participant) => participant !== userId); // need to extract userId here

  const socketContext = useSocket();

  useEffect(() => {
    return () => {
      setMessages([]);
    };
  }, [chat_id]);

  useEffect(() => {
    if (socketContext.socket) {
      const handler = ({ chatId, ...res }) => {
        if (res.from_id === to_id) {
          setMessages((prev) => [...prev, res]);
        }
      };
      socketContext.socket.on("recv_msg", handler);

      return () => {
        // Unsubscribe event listeners to prevent multiple messages
        socketContext.socket.off("recv_msg", handler);
      };
    }
  }, [socketContext.socket, chat_id]);

  useEffect(() => {
    (async () => {
      if (chat_id) {
        const resp = await axiosInstance.get(
          `/chat/messages/${chat_id}/${pageId}`
        );
        const arr = resp.data.reverse();
        setMessages((prev) => {
          return [...arr, ...prev];
        });
      }
    })();
  }, [chat_id, pageId]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (socketContext.socket) {
      const newMessage = {
        created_at: Date.now(),
        content: { message: value },
        to_id,
        type: "text",
      };
      socketContext.socket.emit("send_msg", {
        msg: newMessage,
        chatId: chat_id,
      });
      setMessages((prev) => [...prev, { ...newMessage, from_id: userId }]);
    }
  };

  const sendSong = (song) => {
    console.log("Send song", song);
    if (socketContext.socket) {
      const newMessage = {
        created_at: Date.now(),
        content: song,
        to_id,
        type: "song",
      };
      socketContext.socket.emit("send_msg", {
        msg: newMessage,
        chatId: chat_id,
      });
      setMessages((prev) => [...prev, { ...newMessage, from_id: userId }]);
    }
    setOpen(false);
  };

  const displayMessage = (msg) => {
    switch (msg.type) {
      case "song":
        return (
          <Audio
            image_url={msg.content.image_url}
            preview_url={msg.content.preview_url}
            name={msg.content.name}
            artists={msg.content.artists}
          />
        );
      case "text":
        return msg.content.message;
      default:
        return null;
    }
  };

  const messageContainerRef = useRef(null);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages.length]);

  const onEmojiClick = () => {};
  return (
    <div className="chattyWrapper">
      <div className="chatHeader">
        {!isDesktop && (
          <button
            onClick={() => {
              setShowChat(false);
            }}
          >
            <BsArrowLeftShort />
          </button>
        )}
        <div className="imageContainer">
          <img src={selectedChat.otherUser.image_url} className="userImg" />
        </div>
        <p>{selectedChat.otherUser.display_name}</p>
      </div>

      <div className="chatsMain" ref={messageContainerRef}>
        {(pageId + 1) * 20 > messages.length ? null : (
          <button
            onClick={() => {
              setPageId((prev) => prev + 1);
            }}
          >
            Load More
          </button>
        )}
        {messages.map((msg) => (
          <div
            key={msg.created_at}
            className={`${
              msg.from_id === userId ? "fromUser" : "toUser"
            } singleMsg `}
          >
            {/* {msg.type === "song" ? msg.content.name : msg.content.message} */}
            {displayMessage(msg)}
            <p>{moment(msg.created_at).format("LT")}</p>
          </div>
        ))}
      </div>
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
        <form className="inputContainer" onSubmit={sendMessage}>
          <input
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            placeholder="Type your message"
            className="inputMsg"
          />
          <button type="submit" className="sendMsgBtn">
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
