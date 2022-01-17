import { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useRecoilValue } from "recoil";
import Wrapper from "./components/Wrapper";
import { SocketProvider } from "./context/socketContext";
import useAuth from "./hooks/useAuth";
import useProfile from "./hooks/useProfile";
import { userNameSelector } from "./recoil/userAtom";
import AuthRoute from "./routes/AuthRoute";
import About from "./views/About";
import Home from "./views/Home";
import MySpace from "./views/MySpace/MySpace";
import ReadyToRock from "./views/ReadyToRock";
import Rolling from "./views/Rolling";

const code = new URLSearchParams(window.location.search).get("code");

const App = () => {
  useAuth(code);
  const displayName = useRecoilValue(userNameSelector);
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
    const handle = localStorage.getItem("handle");
    if (!displayName && handle && handle !== "undefined") {
      getUserProfile(handle);
    }
  }, [displayName]);

  const isAuthenticated = false;

  return (
    <SocketProvider>
      {isAuthenticated ? (
        <AuthRoute />
      ) : (
        <Router>
          <Wrapper>
            <Switch>
              <Route exact path="/readytorock" component={ReadyToRock} />
              <Route exact path="/rolling" component={Rolling} />
              <Route exact path="/about" component={About} />
              <Route exact path="/" component={Home} />
              <Route path="/:handle" component={MySpace} />
            </Switch>
          </Wrapper>
        </Router>
      )}
    </SocketProvider>
  );
};

export default App;
