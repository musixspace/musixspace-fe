import React, { useState } from "react";
import Requests from "./Requests";
import Tabs from "./Tabs";

const Chat = () => {
  const [tab, setTab] = useState(1);

  return (
    <div style={{ marginTop: "20vh" }}>
      <Tabs tab={tab} setTab={setTab} />
      {tab === 1 ? <Requests /> : null}
    </div>
  );
};

export default Chat;
