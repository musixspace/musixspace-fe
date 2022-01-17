import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import Logout from "../components/Logout";
import Wrapper from "../components/Wrapper";
import Discover from "../views/Discover";
import Insights from "../views/Insights";
import Match from "../views/Match";
import MoodRadio from "../views/MoodRadio";
import MySpace from "../views/MySpace/MySpace";
import SurpriseMe from "../views/SurpriseMe";
import TopArtists from "../views/TopArtists";
import TopTracks from "../views/TopTracks";
import PrivateRoute from "./PrivateRoute";

const AuthRoute = () => {
  useEffect(() => {
    console.log("From Auth Route");
  }, []);

  return (
    <Router>
      <Wrapper>
        <Switch>
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
          <PrivateRoute exact path="/discover" component={Discover} />
          <PrivateRoute exact path="/match/:matchHandle" component={Match} />
          <PrivateRoute exact path="/logout" component={Logout} />
          <PrivateRoute exact path="/:handle" component={MySpace} />
        </Switch>
      </Wrapper>
    </Router>
  );
};

export default AuthRoute;
