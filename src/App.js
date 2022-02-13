import { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useRecoilValue } from "recoil";
import Logout from "./components/Logout";
import Wrapper from "./components/Wrapper";
import useAuth from "./hooks/useAuth";
import useProfile from "./hooks/useProfile";
import { userNameSelector } from "./recoil/userAtom";
import About from "./views/About";
import ColorThief from "./views/ColorThief";
import Discover from "./views/Discover";
import Feed from "./views/Feed/Feed";
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

  return (
    <Router>
      <Wrapper>
        <Switch>
          <Route exact path="/readytorock" component={ReadyToRock} />
          <Route exact path="/rolling" component={Rolling} />
          <Route exact path="/insights/mood" component={MoodRadio} />
          <Route exact path="/insights/surprise" component={SurpriseMe} />
          <Route exact path="/insights/topartists" component={TopArtists} />
          <Route exact path="/insights/toptracks" component={TopTracks} />
          <Route exact path="/insights" component={Insights} />
          <Route exact path="/feed" component={Feed} />
          <Route exact path="/feed/:id" component={IndPost} />
          <Route exact path="/discover" component={Discover} />
          <Route exact path="/match/:matchHandle" component={Match} />
          <Route exact path="/about" component={About} />
          <Route exact path="/color" component={ColorThief} />
          <Route exact path="/logout" component={Logout} />
          <Route exact path="/" component={Home} />
          <Route path="/:handle" component={MySpace} />
        </Switch>
      </Wrapper>
    </Router>
  );
};

export default App;
