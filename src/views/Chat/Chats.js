import { useEffect, useState } from "react";
import { axiosInstance } from "../../util/axiosConfig";

const Chats = ({ setSelectedChat }) => {
  const [chatList, setChatList] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const resp = await axiosInstance.get("/chat");
        setChatList(resp.data);
        console.log(resp.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <>
      {chatList.map((item) => {
        return (
          <div
            onClick={() => {
              setSelectedChat(item);
            }}
            key={item.chat_id}
            className="chatListItem"
          >
            <div className="imageContainer">
              <img src={item.otherUser.image_url} className="userImg" />
            </div>
            <p>{item.otherUser.display_name}</p>
          </div>
        );
      })}
      {/* {selectedChat !== null && <ChatWindow selectedChat={selectedChat} />} */}
    </>
  );
};
export default Chats;
