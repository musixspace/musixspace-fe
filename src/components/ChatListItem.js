import moment from "moment";
import { useMemo } from "react";

import logo from "../assets/images/logo-black.png";
import { useChat } from "../context/chatContext";
import { getFormattedTime } from "../util/functions";

const ChatItemList = ({ chat, setShowChat }) => {
  const { selectedChat, setSelectedChat, setChats } = useChat();

  const handleClick = () => {
    setShowChat(true);
    setSelectedChat(chat);
    setChats((prev) => {
      return prev.map((item) => {
        if (item.chat_id === chat.chat_id) {
          return {
            ...item,
            unread_count: 0,
          };
        }
        return { ...item };
      });
    });
  };

  return (
    <div
      className={`cli-container ${
        selectedChat?.chat_id === chat?.chat_id && "selected-chat"
      }`}
      onClick={() => {
        handleClick();
      }}
    >
      <div className="cli-image-container">
        <img src={chat.otherUser.image_url || logo} alt={"user-image"} />
      </div>
      <div className="cli-user-details-container">
        <div className="cli-user-container">
          <div>
            <p>{chat.otherUser.display_name}</p>
          </div>
          <div>
            <p>{chat.lastMessage.content}</p>
          </div>
        </div>
        <div className="cli-time-container">
          <p>{getFormattedTime(chat.lastMessage.created_at)}</p>
          {chat.unread_count > 0 && <p>{chat.unread_count || ""}</p>}
        </div>
      </div>
    </div>
  );
};

export default ChatItemList;
