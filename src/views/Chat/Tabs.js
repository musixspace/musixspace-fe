import React from "react";

const tabs = ["Chats", "Requests"];

const Tabs = ({ tab, setTab }) => {
  return (
    <div>
      {tabs.map((item, i) => (
        <button
          key={item}
          onClick={() => {
            setTab(i);
          }}
          style={{ background: tab === i ? "orchid" : "crimson" }}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
