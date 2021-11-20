import React from "react";

const Loading = ({ bg }) => {
  return (
    <div className="loading-div" style={{ backgroundColor: `var(${bg})` }}>
      <div className="loader">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loading;
