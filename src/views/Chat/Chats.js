import { useEffect } from "react";
import Logo from "../../assets/images/logo-black.png";
import { useChat } from "../../context/chatContext";
import { axiosInstance } from "../../util/axiosConfig";

const Chats = ({ setShowChat }) => {
  const { chats, setChats, setSelectedChat } = useChat();

  useEffect(() => {
    (async () => {
      try {
        const resp = await axiosInstance.get("/chat");
        setChats(resp.data);
        console.log(resp.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <>
      {chats.map((item) => {
        return (
          <div
            onClick={() => {
              setSelectedChat(item);
              setShowChat(true);
            }}
            key={item.chat_id}
            className="chatListItem"
          >
            <div className="imageContainer">
              <img src={item.otherUser.image_url || Logo} className="userImg" />
            </div>
            <p>{item.otherUser.display_name}</p>
          </div>
        );
      })}
    </>
  );
};
export default Chats;
