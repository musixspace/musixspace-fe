import React from "react";

const tabs = ["Chats", "Requests"];

const Tabs = ({ tab, setTab }) => {
  return (
    <>
      {tabs.map((item, i) => (
        <button
          key={item}
          className={`chatTab ${tab === i && "selectedTab"}`}
          onClick={() => {
            setTab(i);
          }}
        >
          {item}
        </button>
      ))}
    </>
  );
};

export default Tabs;
