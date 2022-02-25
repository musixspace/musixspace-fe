import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import "./assets/scss/index.scss";
import { RecoilRoot } from "recoil";

const rootElement = document.getElementById("root");
if (rootElement.hasChildNodes()) {
  ReactDOM.hydrate(
    <React.StrictMode>
      <Router>
        <RecoilRoot>
          <App />
        </RecoilRoot>
      </Router>
    </React.StrictMode>,
    rootElement,
  );
} else {
  ReactDOM.render(
    <React.StrictMode>
      <Router>
        <RecoilRoot>
          <App />
        </RecoilRoot>
      </Router>
    </React.StrictMode>,
    rootElement,
  );
}

// ReactDOM.render(
//   <React.StrictMode>
//     <Router>
//       <RecoilRoot>
//         <App />
//       </RecoilRoot>
//     </Router>
//   </React.StrictMode>,
//   document.getElementById("root")
// );
