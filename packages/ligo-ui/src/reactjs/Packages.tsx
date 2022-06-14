import * as React from 'react';

import type { pkg } from '../types';
import { Header as AppHeader } from './Header';
import { Link } from './Link';

type props = {
  packages: pkg[];
};

function PackagesList(props: props) {
  let { packages } = props;
  return (
    <ul className="w-full md:w-2/3 lg:w-1/2 m-auto">
      {packages.map(({ name, version, description, author }, i) => {
        return (
          <li className="rounded-lg border-2 border-slate-800 p-4 m-4 block" key={i}>
            <Link to={`/package/${name}`}>
              <div className="card-title">
                {name} <span className="text-sm italic text-slate-300">{version}</span>{' '}
              </div>
              <div>
                <span className="text-slate-300">By&nbsp;</span>
                <span className="text-slate-400">{author.name}</span>
              </div>
              <p>{description}</p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

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
          <PackagesList packages={packages} />
        </section>
      </>
    );
  }
}
