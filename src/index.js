import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import registerServiceWorker from "./registerServiceWorker";

import { store } from "./_helpers";
import { PegaApp } from "./PegaApp/PegaApp";

import "./_styles/index.css";
import "semantic-ui-css/semantic.min.css";
import "react-datepicker/dist/react-datepicker.css";
import "./_styles/uikit/pega-icons.css";

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <PegaApp />      
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);

registerServiceWorker();
