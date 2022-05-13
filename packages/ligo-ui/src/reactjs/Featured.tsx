import * as React from 'react';

import type { pkg } from '../types';
import { Header as AppHeader } from './Header';
import { PackagesList } from './PackagesList';

type props = {
  packages: pkg[];
};
export function Featured({ packages }: props) {
  if (packages.length === 0) {
    return (
      <section className="md:w-2/3 m-auto p-8 mt-16">
        <h1> Nothing featured right now! </h1>
      </section>
    );
  } else {
    return (
      <>
        <AppHeader />
        <h1 className="text-center"> Featured Packages </h1>
        <section className="md:w-2/3 m-auto p-8 mt-16">
          <PackagesList packages={packages} />
        </section>
      </>
    );
  }
}
