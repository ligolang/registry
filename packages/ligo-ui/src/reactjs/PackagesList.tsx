import * as React from 'react';

import type { pkg } from '../types';
import { Link } from './Link';

type props = {
  packages: pkg[];
};

export function PackagesList(props: props) {
  let { packages } = props;
  return (
    <ul className="w-full flex flex-row items-start flex-wrap">
      {packages.map(({ name, version, description }, i) => {
        let descriptionSliced;
        if (description.length > 30) {
          descriptionSliced = description.slice(0, 27) + ' ..';
        } else {
          descriptionSliced = description;
        }
        return (
          <li className="h-30 block card" key={i}>
            <Link to={`/package/${name}`}>
              <div className="card-title">
                {name} <span className="text-sm italic text-slate-300">{version}</span>{' '}
              </div>
              <div>
                <span className="text-slate-300">By&nbsp;</span>
                <span className="text-slate-400">Sindre Horus</span>
              </div>
              <p>{descriptionSliced}</p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
