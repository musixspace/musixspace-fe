import logo from "../assets/images/logo-black.png";
import { useChat } from "../context/chatContext";

const ChatItemList = ({ chat, setShowChat }) => {
  const { setSelectedChat } = useChat();
  return (
    <div
      className="cli-container"
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
          <p>{chat.otherUser.display_name}</p>
          <div>
            <p>Hello man!Hello man!Hello man!Hello man!</p>
          </div>
        </div>
        <div className="cli-time-container">
          <span>yesterday</span>
        </div>
      </div>
    </div>
  );
};

export default ChatItemList;
