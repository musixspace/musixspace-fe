import moment from "moment";

import logo from "../assets/images/logo-black.png";
import { useChat } from "../context/chatContext";
import { getFormattedTime } from "../util/functions";

const ChatItemList = ({ chat, setShowChat }) => {
  const { selectedChat, setSelectedChat } = useChat();

  return (
    <div
      className={`cli-container ${
        selectedChat?.chat_id === chat?.chat_id && "selected-chat"
      }`}
      onClick={() => {
        setShowChat(true);
        setSelectedChat(chat);
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
          <span>{getFormattedTime(chat.lastMessage.created_at)}</span>
        </div>
      </div>
    </div>
  );
};

export default ChatItemList;
