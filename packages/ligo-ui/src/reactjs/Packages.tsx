import * as React from 'react';

import type { pkg } from '../types';
import { Header as AppHeader } from './Header';
import { PackagesList } from './PackagesList';

type props = {
  packages: pkg[];
};

export function Packages({ packages }: props) {
  if (packages.length === 0) {
    return (
      <section className="md:w-2/3 m-auto p-8 mt-16">
        <h1> Empty registry </h1>
      </section>
    );
  } else {
    return (
      <>
        <AppHeader />
        <h1 className="text-center"> All Packages </h1>
        <section className="p-8 mt-16">
          <PackagesList
            packages={packages
              .concat(packages)
              .concat(packages)
              .concat(packages)
              .concat(packages)
              .concat(packages)}
          />
        </section>
      </>
    );
  }
}
