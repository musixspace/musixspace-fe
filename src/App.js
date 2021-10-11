import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import useAuth from "./useAuth";
import Home from "./views/Home";
import Insights from "./views/Insights";
import TopTracks from "./views/TopTracks";

const code = new URLSearchParams(window.location.search).get("code");

const App = () => {
  const accessToken = useAuth(code);

  const callAuth = () => {
    console.log("Access Token is ", accessToken);
    localStorage.setItem("accessToken", accessToken);
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
        <Route exact path="/insights" component={Insights} />
        <Route exact path="/top-tracks" component={TopTracks} />
        <Route exact path="/" component={Home} />
      </Switch>
    </Router>
  );
};

export default App;
