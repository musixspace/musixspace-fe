import { useEffect } from "react";
import ChatItemList from "../../components/ChatListItem";
import { useChat } from "../../context/chatContext";
import { axiosInstance } from "../../util/axiosConfig";
import songRequestImage from "../../assets/images/song-request.png";

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
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <div className="requests-Wrapper">
      {/* <p className="request-title">RECENT MATCHES</p>
      <div className="image-header">
        <img src={songRequestImage} alt="chat with matches" />
      </div> */}
      <p className="request-title">CONVERSATIONS</p>
      <ul>
        {chats.length <=0 ? <p style={{color: '#ffffff',fontStyle:'italic', marginTop: '50%'}}>No conversations in this jukebox, please send a song to start one!</p> : (
        chats.map((item, i) => {
          return <ChatItemList key={i} chat={item} setShowChat={setShowChat} />;
        }))}
      </ul>
    </div>
  );
};
export default Chats;
