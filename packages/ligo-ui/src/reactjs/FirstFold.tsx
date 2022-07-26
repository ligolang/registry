import * as React from 'react';

import { HistoryContext } from '../HistoryContext';
import { handleSubmit } from '../handlers';
import type { pkg } from '../types';
import { Link } from './Link';

type props = {
  packages: pkg[];
};
export function FirstFold(props: props) {
  let { packages } = props;
  return (
    <section className="w-full p-6 lg:flex-1 lg:flex flex-col items-center">
      <HistoryContext.Consumer>
        {(history) => (
          <>
            <header className="flex flex-row md:w-2/3 lg:w-1/2 m-auto">
              <img className="w-24 block ml-16 mr-0" src="/logo.svg" alt="Ligo Logo" />
              <h1 className="m-6 text-center uppercase leading-tight">Ligo Registry</h1>
            </header>
            <form
              style={{ height: '5rem' }}
              onSubmit={handleSubmit(history)}
              className="mt-4 md:w-2/3 lg:w-1/2 w-full relative"
            >
              <input
                name="query"
                className="w-full absolute top-0 left-0 h-16 block rounded-full p-4 pl-6"
                placeholder="Search and see what the community has to offer"
              />
              <button
                type="submit"
                className="h-16 w-16 mr-6 absolute top-0 right-0 rounded-full w-6 h-6"
              >
                <img
                  className="absolute top-0 right-0 w-8 h-16 block"
                  src="./icons/search.svg"
                  alt="search"
                />
              </button>
            </form>
            <section className="w-full">
              <h2 className="text-3xl m-4"> Curated by developers </h2>
              <ul className="w-full flex flex-row items-start flex-wrap">
                {packages.map(({ name, version, author }, i) => (
                  <li className="h-30 block card" key={i}>
                    <Link to={`/package/${name}`}>
                      <div className="card-title">
                        {name} <span className="text-sm italic text-slate-300">{version}</span>{' '}
                      </div>
                      <div>
                        <span className="text-slate-300">By&nbsp;</span>
                        <span className="text-slate-400">{author?.name || 'Anonymous'}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </HistoryContext.Consumer>
    </section>
  );
}
