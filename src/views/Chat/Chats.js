import { useEffect, useState } from "react";
import { axiosInstance } from "../../util/axiosConfig";
import ChatWindow from "./ChatWindow";

const Chats = () => {
  const [chatList, setChatList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const resp = await axiosInstance.get("/chat");
        setChatList(resp.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  return (
    <div>
      <div>
        {chatList.map((item) => {
          return (
            <div
              onClick={() => {
                setSelectedChat(item.chat_id);
              }}
            >
              Chat
            </div>
          );
        })}
      </div>
      <ChatWindow chatId={selectedChat} />
    </div>
  );
};
export default Chats;
