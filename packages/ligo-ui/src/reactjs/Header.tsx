import * as React from 'react';

import { HistoryContext } from '../HistoryContext';
import { Link } from './Link';

export function Header() {
  return (
    <HistoryContext.Consumer>
      {(history) => {
        let home;
        if (history.location.pathname !== '/') {
          home = (
            <Link className="inline-block p-4" to="/">
              Home
            </Link>
          );
        } else {
          home = <span />;
        }
        return (
          <header className="p-4  w-full text-right">
            <nav>
              {home}
              {/* <Link className="inline-block p-4" to="/getting-started">
                  Getting Started
                  </Link> */}
              <Link className="inline-block p-4" to="http://ligolang.org/">
                About Ligo
              </Link>
              <Link className="inline-block p-4" to="/packages">
                Packages
              </Link>
            </nav>
          </header>
        );
      }}
    </HistoryContext.Consumer>
  );
}
