import * as React from 'react';

import type { pkg } from '../types';
import { Header as AppHeader } from './Header';
import { Link } from './Link';

type result = {
  package: pkg;
};
export function Search({ results, searchTerm }: { searchTerm: string; results: result[] }) {
  if (results.length === 0) {
    return (
      <section className="md:w-2/3 m-auto p-8 mt-16">
        <h1> No results found </h1>
      </section>
    );
  } else {
    let packages = results.map(({ package: p }) => p);
    return (
      <>
        <AppHeader />
        <section className="md:w-2/3 m-auto p-8 mt-16">
          <h1 className="text-center">
            {' '}
            {results.length} results found for <span className="mg-search-term">{searchTerm}</span>{' '}
          </h1>

          {/* @ts-ignore */}
          {packages.map((pkg, i: number) => (
            <section key={i} className="mt-2 p-6 border rounded-xl border-gray">
              <h2>
                <Link to={'/package/' + encodeURIComponent(pkg.name)}>{pkg.name}</Link>
              </h2>
              <p>v{pkg.version}</p>
              <p>
                {' '}
                <span className="text-gray-400">By</span> {pkg.author?.name || ''}{' '}
              </p>
              <p>{pkg.description}</p>
            </section>
          ))}
        </section>
      </>
    );
  }
}
