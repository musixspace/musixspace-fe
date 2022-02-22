import React, { useEffect, useState } from "react";
import RequestListItem from "../../components/RequestListItem";
import { useChat } from "../../context/chatContext";
import { useSocket } from "../../context/socketContext";
import { axiosInstance } from "../../util/axiosConfig";

const Requests = () => {
  const { requests, setRequests } = useChat();
  const socketContext = useSocket();

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get("/chat/requests");
        setRequests(res.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    if (socketContext.socket) {
      socketContext.socket.on("receive-request", (req) => {
        setRequests((prev) => [...prev, req]);
      });
    }
  }, [socketContext.socket]);

  return (
    <ul>
      {requests.map((req, i) => (
        // <li key={i}>
        //   <p>{req.username}</p>
        //   <button onClick={() => handleAccept(req.request_id)}>Accept</button>
        // </li>
        <RequestListItem request={req} key={i} />
      ))}
    </ul>
  );
};

export default Requests;
