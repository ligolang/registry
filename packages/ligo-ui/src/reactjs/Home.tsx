import * as React from 'react';

import type { pkg } from '../types';
import { FirstFold } from './FirstFold';
import { Header } from './Header';

type props = {
  packages: pkg[];
};

export function Home(props: props) {
  let { packages } = props;
  return (
    <>
      <Header />
      <FirstFold packages={packages} />
    </>
  );
}
