import { useEffect, useState } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { io } from "socket.io-client";
import Logout from "./components/Logout";
import Wrapper from "./components/Wrapper";
import { ChatContext } from "./context/chatContext";
import { SocketContext } from "./context/socketContext";
import useAuth from "./hooks/useAuth";
import useProfile from "./hooks/useProfile";
import { alertAtom } from "./recoil/alertAtom";
import { userState } from "./recoil/userAtom";
import PrivateRoute from "./routes/PrivateRoute";
import About from "./views/About";
import Chat from "./views/Chat/Chat";
import Discover from "./views/Discover";
import Feed, { decodeJWT } from "./views/Feed/Feed";
import IndPost from "./views/Feed/IndPost";
import Home from "./views/Home";
import Insights from "./views/Insights";
import Match from "./views/Match";
import MoodRadio from "./views/MoodRadio";
import MySpace from "./views/MySpace/MySpace";
import ReadyToRock from "./views/ReadyToRock";
import Rolling from "./views/Rolling";
import SurpriseMe from "./views/SurpriseMe";
import TopArtists from "./views/TopArtists";
import TopTracks from "./views/TopTracks";

const code = new URLSearchParams(window.location.search).get("code");

const App = () => {
  const [socket, setSocket] = useState(null);

  const location = useLocation();
  console.log(location);

  // State for chat context
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [requests, setRequests] = useState([]);

  useAuth(code);
  const { isAuthenticated } = useRecoilValue(userState);
  const setAlert = useSetRecoilState(alertAtom);

  const { getUserProfile } = useProfile();

  useEffect(() => {
    if (
      localStorage.getItem("accessToken") &&
      !window.location.href.includes("insights") &&
      sessionStorage.getItem("newUser") === false
    ) {
      console.log("Entered here 2");
      window.location = window.location.origin + "/insights";
    } else if (
      window.location.pathname === "/" &&
      localStorage.getItem("accessToken")
    ) {
      window.location = window.location.origin + "/insights";
    }

    const viewport = document.querySelector("meta[name=viewport]");
    viewport.setAttribute(
      "content",
      "height=" +
        window.innerHeight +
        "px, width=" +
        window.innerWidth +
        "px, initial-scale=1.0"
    );
  }, []);

  useEffect(() => {
    (async () => {
      const handle = localStorage.getItem("handle");
      const token = localStorage.getItem("accessToken");
      if (token) {
        getUserProfile(handle);
      }
    })();
  }, []);

  useEffect(() => {
    let newSocket;

    if (isAuthenticated) {
      newSocket = io(process.env.REACT_APP_SOCKET_URI, {
        transports: ["websocket"],
        query: { userId: decodeJWT().user.id },
      });
      setTimeout(() => {
        console.log(newSocket);
        setSocket(newSocket);
      }, 2000);
    }

    return () => {
      newSocket && newSocket.disconnect();
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (socket) {
      socket.on("error", ({ err }) => {
        setAlert({ open: true, message: err, type: "error" });
      });

      const receiveHandler = ({ chatId, ...res }) => {
        if (location.pathname !== "/chat") {
          setNotifications((prev) => [...prev, { chatId, ...res }]);
        } else {
          if (!selectedChat) {
            setNotifications((prev) => [...prev, { chatId, ...res }]);
          } else if (selectedChat.chat_id !== chatId) {
            setNotifications((prev) => [...prev, { chatId, ...res }]);
          }
          updateLastMessageForChat(res, chatId);
        }
      };

      socket.on("recv_msg", receiveHandler);

      return () => {
        socket.off("recv_msg", receiveHandler);
      };
    }
  }, [socket, selectedChat]);

  const updateLastMessageForChat = (newMessage, chat_id) => {
    const updatedChats = chats.map((chat) => {
      if (chat.chat_id === chat_id) {
        return {
          ...chat,
          lastMessage: {
            content:
              newMessage.type === "song"
                ? "Sent a song"
                : newMessage.content.message,
            created_at: newMessage.created_at,
          },
        };
      }
      return chat;
    });
    setChats(updatedChats);
  };

  return (
    <SocketContext.Provider value={{ socket }}>
      <ChatContext.Provider
        value={{
          selectedChat,
          chats,
          requests,
          notifications,
          setChats,
          setNotifications,
          setRequests,
          setSelectedChat,
          updateLastMessageForChat,
        }}
      >
        <Wrapper>
          <Switch>
            <Route exact path="/readytorock" component={ReadyToRock} />
            <Route exact path="/rolling" component={Rolling} />
            <Route exact path="/" component={Home} />
            <Route exact path="/about" component={About} />
            <Route exact path="/feed" component={Feed} />
            <Route exact path="/feed/:id" component={IndPost} />
            <PrivateRoute exact path="/insights/mood" component={MoodRadio} />
            <PrivateRoute
              exact
              path="/insights/surprise"
              component={SurpriseMe}
            />
            <PrivateRoute
              exact
              path="/insights/topartists"
              component={TopArtists}
            />
            <PrivateRoute
              exact
              path="/insights/toptracks"
              component={TopTracks}
            />
            <PrivateRoute exact path="/insights" component={Insights} />
            <PrivateRoute exact path="/feed" component={Feed} />
            <PrivateRoute exact path="/discover" component={Discover} />
            <PrivateRoute exact path="/match/:matchHandle" component={Match} />
            <PrivateRoute exact path="/logout" component={Logout} />
            <PrivateRoute exact path="/chat" component={Chat} />
            <Route path="/:handle" component={MySpace} />
          </Switch>
        </Wrapper>
      </ChatContext.Provider>
    </SocketContext.Provider>
  );
};

export default App;
