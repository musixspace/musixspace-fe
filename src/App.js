import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Logout from "./components/Logout";
import Wrapper from "./components/Wrapper";
import useAuth from "./hooks/useAuth";
import About from "./views/About";
import Discover from "./views/Discover";
import Home from "./views/Home";
import Insights from "./views/Insights";
import MoodRadio from "./views/MoodRadio";
import MySpace from "./views/MySpace";
import ReadyToRock from "./views/ReadyToRock";
import Rolling from "./views/Rolling";
import SurpriseMe from "./views/SurpriseMe";
import TopArtists from "./views/TopArtists";
import TopTracks from "./views/TopTracks";

const code = new URLSearchParams(window.location.search).get("code");

const App = () => {
  useAuth(code);

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
          <Route exact path="/discover" component={Discover} />
          <Route exact path="/about" component={About} />
          <Route exact path="/logout" component={Logout} />
          <Route exact path="/" component={Home} />
          <Route path="/:username" component={MySpace} />
        </Switch>
      </Wrapper>
    </Router>
  );
};

export default App;
