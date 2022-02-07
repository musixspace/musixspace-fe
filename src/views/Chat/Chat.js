import React, { useState } from "react";
import Requests from "./Requests";
import Chats from "./Chats";
import Tabs from "./Tabs";

const Chat = () => {
  const [tab, setTab] = useState(0);

  return (
    <div style={{ marginTop: "20vh" }}>
      <Tabs tab={tab} setTab={setTab} />
      {tab === 1 ? <Requests /> : <Chats />}
    </div>
  );
};

export default Chat;
