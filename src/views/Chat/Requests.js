import React, { useEffect, useState } from "react";
import { useSocket } from "../../context/socketContext";
import { axiosInstance } from "../../util/axiosConfig";

const Requests = () => {
  const [requests, setRequests] = useState([]);
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
        <li key={i}>{req.username}</li>
      ))}
    </ul>
  );
};

export default Requests;
