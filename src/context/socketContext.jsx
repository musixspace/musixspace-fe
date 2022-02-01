import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { createContext } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext({
  socket: null,
});

export const useSocket = () => {
  return useContext(SocketContext);
};
