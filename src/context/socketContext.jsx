import { createContext, useContext } from "react";

export const SocketContext = createContext({
  socket: null,
});

export const useSocket = () => {
  return useContext(SocketContext);
};
