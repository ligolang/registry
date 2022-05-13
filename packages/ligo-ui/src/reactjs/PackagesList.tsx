import * as React from 'react';

import type { pkg } from '../types';
import { Link } from './Link';

type props = {
  packages: pkg[];
};

export function PackagesList(props: props) {
  let { packages } = props;
  return (
    <>
      {/* @ts-ignore */}
      {packages.map((pkg, i: number) => (
        <section key={i} className="mt-2 p-4 border rounded border-gray">
          <h2>
            <Link to={'/package/' + encodeURIComponent(pkg.name)}>{pkg.name}</Link>
          </h2>
          <p>v{pkg.version}</p>
          <p>
            {' '}
            <span className="text-gray-400">By</span> {(pkg.author && pkg.author.name) || ''}{' '}
          </p>
          <p>{pkg.description}</p>
        </section>
      ))}
    </>
  );
}
