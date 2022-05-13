import * as React from 'react';

import type { pkg } from '../types';
import { Header as AppHeader } from './Header';
import { PackagesList } from './PackagesList';

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
    return (
      <>
        <AppHeader />
        <section className="md:w-2/3 m-auto p-8 mt-16">
          <h1 className="text-center">
            {' '}
            {results.length} results found for <span className="mg-search-term">{searchTerm}</span>{' '}
          </h1>
          <PackagesList packages={results.map(({ package: p }) => p)} />
        </section>
      </>
    );
  }
}
