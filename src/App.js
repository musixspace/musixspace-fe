import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import useAuth from "./useAuth";
import About from "./views/About";
import Discover from "./views/Discover";
import Home from "./views/Home";
import Insights from "./views/Insights";
import MoodRadio from "./views/MoodRadio";
import ReadyToRock from "./views/ReadyToRock";
import SurpriseMe from "./views/SurpriseMe";
import TopArtists from "./views/TopArtists";
import TopTracks from "./views/TopTracks";

const code = new URLSearchParams(window.location.search).get("code");

const App = () => {
  const { accessToken, refreshToken } = useAuth(code);

  const callAuth = () => {
    console.log("Access Token is ", accessToken);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    window.location.href = window.location.origin + "/insights";
  };

  useEffect(() => {
    if (accessToken) {
      callAuth();
    }
  }, [accessToken]);

  return (
    <Router>
      <Switch>
        {accessToken && <Redirect to="/insights" />}
        <Route exact path="/readytorock" component={ReadyToRock} />
        <Route exact path="/insights/mood" component={MoodRadio} />
        <Route exact path="/insights/surprise" component={SurpriseMe} />
        <Route exact path="/insights/topartists" component={TopArtists} />
        <Route exact path="/insights/toptracks" component={TopTracks} />
        <Route exact path="/insights" component={Insights} />
        <Route exact path="/discover" component={Discover} />
        <Route exact path="/about" component={About} />
        <Route exact path="/" component={Home} />
      </Switch>
    </Router>
  );
};

export default App;
