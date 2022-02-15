import React, { useEffect, useMemo, useState } from "react";
import Requests from "./Requests";
import Chats from "./Chats";
import Tabs from "./Tabs";
import ChatWindow from "./ChatWindow";
import { useWindowSize } from "../../hooks/useWindowDimensions";

const Chat = () => {
  const [tab, setTab] = useState(0);
  const [selectedChat, setSelectedChat] = useState(null);
  const [showChat, setShowChat] = useState(false);
  // const [isDesktop, setIsDesktop] = useState(false);

  const { width } = useWindowSize();

  const isDesktop = useMemo(() => {
    return width > 976;
  }, [width]);

  return (
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
                  selectedChat={selectedChat}
                  setSelectedChat={setSelectedChat}
                />
              )}
            </div>
          </div>
        )}{" "}
        :{" "}
        {(showChat || isDesktop) && (
          <div className="chatWindow">
            {selectedChat && (
              <ChatWindow
                isDesktop={isDesktop}
                setShowChat={setShowChat}
                selectedChat={selectedChat}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
