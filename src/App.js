import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import useAuth from "./useAuth";
import Dashboard from "./views/Dashboard/Dashboard";
import Home from "./views/Home/Home";

const code = new URLSearchParams(window.location.search).get("code");

const App = () => {
  const accessToken = useAuth(code);

  const callAuth = () => {
    console.log("Access Token is ", accessToken);
    localStorage.setItem("accessToken", accessToken);
    window.location.href = window.location.origin + "/dashboard";
  };

  useEffect(() => {
    if (accessToken) {
      callAuth();
    }
  }, [accessToken]);

  return (
    <Router>
      <div
        className="wrapper"
        style={
          window.location.pathname.includes("dashboard")
            ? { backgroundColor: "var(--bg-dashboard)" }
            : { backgroundColor: "var(--bg-home)" }
        }
      >
        <Navbar />
        <Switch>
          {accessToken && <Redirect to="/dashboard" />}
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/" component={Home} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
