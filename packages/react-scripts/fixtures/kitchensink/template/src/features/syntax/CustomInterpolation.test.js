/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import ReactDOM from 'react-dom';

import CustomInterpolation from './CustomInterpolation';

describe('custom interpolation', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    return new Promise((resolve) => {
      ReactDOM.render(<CustomInterpolation onReady={resolve} />, div);
    });
  });
});
