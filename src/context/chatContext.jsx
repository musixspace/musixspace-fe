import { createContext, useContext } from "react";

export const ChatContext = createContext({
  selectedChat:null,
  notifications: [],
  chats: [],
  requests:[],
  setSelectedChat:null,
  setRequests:null,
  setNotifications:null,
  setChats:null,
});

export const useChat = () => {
  return useContext(ChatContext);
};
