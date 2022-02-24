import React, { useEffect, useMemo, useState } from "react";
import Requests from "./Requests";
import Chats from "./Chats";
import Tabs from "./Tabs";
import ChatWindow from "./ChatWindow";
import { useWindowSize } from "../../hooks/useWindowDimensions";
import { useChat } from "../../context/chatContext";
import CustomHelmet from "../../components/CustomHelmet";

const Chat = (props) => {
  const [tab, setTab] = useState(0);
  const [showChat, setShowChat] = useState(false);

  const { selectedChat, setSelectedChat } = useChat();
  const selected_chat_id = props.location.state?.chat_id;

  const { width } = useWindowSize();

  useEffect(() => {
    return () => {
      setSelectedChat(null);
    };
  }, []);

  const isDesktop = useMemo(() => {
    return width > 976;
  }, [width]);

  return (
    <>
      <CustomHelmet
        title="Chat"
        description="Real time chat, text/audio chat"
        keywords="Chat, Real time chat, Text Message, Send Song"
      />
      <div className="chatRoot">
        <div className="chatWrapper">
          {(!showChat || isDesktop) && (
            <div className="chatPanel">
              <div className="chatTabs">
                <Tabs tab={tab} setTab={setTab} />
              </div>
              <div className="chatList">
                {tab === 1 ? (
                  <Requests />
                ) : (
                  <Chats
                    setShowChat={setShowChat}
                    selected_chat_id={selected_chat_id}
                  />
                )}
              </div>
            </div>
          )}
          :{" "}
          {(showChat || isDesktop) && (
            <div className="chatWindow">
              {selectedChat && (
                <ChatWindow isDesktop={isDesktop} setShowChat={setShowChat} />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Chat;
