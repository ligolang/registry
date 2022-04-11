import * as React from "react";
import { createBrowserHistory, createMemoryHistory } from "history";

let history =
  typeof window === "undefined"
    ? createMemoryHistory()
    : createBrowserHistory();
const HistoryContext = React.createContext(history);

export { HistoryContext, history };
