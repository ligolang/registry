import type { BrowserHistory } from 'history';
import * as React from 'react';

import { HistoryContext } from '../HistoryContext';

let handleClick =
  (target: string /* url path */, history: BrowserHistory, onClick?: any) =>
  (e: any /* TODO(prometheansacrifice) use appropriate React.Event type */) => {
    e.preventDefault();
    history.push(target);
    if (onClick) {
      onClick(e);
    }
  };

export interface LinkProps {
  to: string;
  children?: React.ReactNode;
  className?: string;
  onClick?: (_: any) => void;
}

export function Link(props: LinkProps) {
  let { to, children, className, onClick } = props;
  return (
    <HistoryContext.Consumer>
      {(history) => (
        <a className={className} onClick={handleClick(to, history, onClick)} href={to}>
          {children}
        </a>
      )}
    </HistoryContext.Consumer>
  );
}
