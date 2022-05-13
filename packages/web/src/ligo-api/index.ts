import { Router } from 'express';

import { hasLogin } from '../utils/web-utils';
import packagesApi from '../api/package';
import search from '../api/search';
import featured from './featured';
import readme from './readme';
import user from '../api/user';

export default (auth, storage, config) => {
  const route = Router(); /* eslint new-cap: 0 */
  route.use('/', packagesApi(storage, auth, config));
  route.use('/', search(storage, auth));
  route.use('/', featured(config, storage, auth));
  route.use('/', readme(config, storage, auth));
  if (hasLogin(config)) {
    route.use('/sec/', user(auth, config));
  }
  return route;
};
