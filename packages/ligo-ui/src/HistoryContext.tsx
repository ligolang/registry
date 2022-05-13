import { createBrowserHistory, createMemoryHistory } from 'history';
import * as React from 'react';

let history = typeof window === 'undefined' ? createMemoryHistory() : createBrowserHistory();
const HistoryContext = React.createContext(history);

export { HistoryContext, history };
