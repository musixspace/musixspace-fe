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

  const handleAccept = async (request_id) => {
    try {
      const resp = await axiosInstance.post("/chat/accept", { request_id });
      console.log(resp);
      const reqs = requests.filter((item) => item.request_id !== request_id);
      setRequests(reqs);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ul>
      {requests.map((req, i) => (
        <li key={i}>
          <p>{req.username}</p>
          <button onClick={() => handleAccept(req.request_id)}>Accept</button>
        </li>
      ))}
    </ul>
  );
};

export default Requests;
