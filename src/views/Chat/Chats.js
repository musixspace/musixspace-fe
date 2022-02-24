import { useEffect } from "react";
import Logo from "../../assets/images/logo-black.png";
import ChatItemList from "../../components/ChatListItem";
import { useChat } from "../../context/chatContext";
import { axiosInstance } from "../../util/axiosConfig";

const Chats = ({ setShowChat, selected_chat_id }) => {
  const { chats, setChats, setSelectedChat } = useChat();

  useEffect(() => {
    (async () => {
      try {
        const resp = await axiosInstance.get("/chat");
        setChats(resp.data);
        resp.data.forEach((item) => {
          if (item.chat_id === selected_chat_id) {
            setSelectedChat(item);
          }
        });
        console.log(resp.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <div>
      {chats.map((item, i) => {
        return <ChatItemList key={i} chat={item} setShowChat={setShowChat} />;
      })}
    </div>
  );
};
export default Chats;
