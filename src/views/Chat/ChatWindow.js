import { useEffect, useState } from "react";
import { axiosInstance } from "../../util/axiosConfig";

const ChatWindow = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const [pageId, setPageId] = useState(0);
  useEffect(() => {
    (async () => {
      if (chatId) {
        const resp = await axiosInstance.get(
          `/chat/messages/${chatId}/${pageId}`,
        );
        console.log(resp);
      }
    })();
  }, [chatId]);

  return <div>Chat Hu Mai</div>;
};
export default ChatWindow;
