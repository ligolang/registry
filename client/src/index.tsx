import React from "react";
import ReactDOM from "react-dom";
import ReactDOMClient from "react-dom";
import { resolve } from "./Routes";

import "./index.css";
import "./reactjs/Package.css";

import { HistoryContext, history } from "./HistoryContext";

function render(path: string) {
  let container = document.getElementById("root");
  if (container === null) {
    throw new Error("Container id='root' doesn't exist");
  }

  resolve(path).then((SelectedReactNode) =>
    ReactDOMClient.hydrate(
      <HistoryContext.Provider value={history}>
        {SelectedReactNode}
      </HistoryContext.Provider>,
      container!
    )
  );
}
let _unlisten = history.listen(({ action, location }) => {
  render(location.pathname);
});

render(window.location.pathname);

/* TODO: When React is unmounted, if ever, history must de-register this
   React based listener */
/* unlisten(); */

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
/* import * as reportWebVitals from './reportWebVitals'; */
/* reportWebVitals(); */
