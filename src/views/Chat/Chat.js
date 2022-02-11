import React, { useState } from "react";
import Requests from "./Requests";
import Chats from "./Chats";
import Tabs from "./Tabs";
import ChatWindow from "./ChatWindow";

const Chat = () => {
  const [tab, setTab] = useState(0);
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div className="chatRoot">
      <div className="chatWrapper">
        <div className="chatPanel">
          <div className="chatTabs">
            <Tabs tab={tab} setTab={setTab} />
          </div>
          <div className="chatList">
            {tab === 1 ? (
              <Requests />
            ) : (
              <Chats
                selectedChat={selectedChat}
                setSelectedChat={setSelectedChat}
              />
            )}
          </div>
        </div>
        <div className="chatWindow">
          {selectedChat && <ChatWindow selectedChat={selectedChat} />}
        </div>
      </div>
    </div>
  );
};

export default Chat;
