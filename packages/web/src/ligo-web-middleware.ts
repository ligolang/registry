import express from 'express';
import StdlibPath from 'path';
import StdlibURL from 'url';

import renderReactApp from './middleware/render-react-app';
import { ligoWebAPI } from './middleware/web-api';

export default (config, auth, storage) => {
  // eslint-disable-next-line new-cap
  const app = express.Router();

  /** TODO(prometheansacrifice) Disable other routes that are no longer needed */
  /** TODO(prometheansacrifice) import index.html as a string (with a webpack plugin ofc. html files cannot be      imported) and exported it from ReactSSR. This way, we can
      1. Eliminate the dependence on the CRA_BUILD_DIR environment variable
      2. Tie the index.html specific knowledge close to ReactSSR package itself. Ex: 

                .replace(
                  `<div id="root" class="h-full overflow-scroll"></div>`,
                  `<div id="root" class="h-full overflow-scroll">${html}</div>`
                )

      It need not leak here
    */
  app.get('/manifest.json', express.static(process.env.CRA_BUILD_DIR!));
  app.use('/icons', express.static(StdlibPath.join(process.env.CRA_BUILD_DIR!, 'icons')));
  app.get('/logo.svg', express.static(process.env.CRA_BUILD_DIR!));
  app.get('/favicon.svg', express.static(process.env.CRA_BUILD_DIR!));
  app.use('/static', express.static(StdlibPath.join(process.env.CRA_BUILD_DIR!, 'static')));

  // web endpoints, search, packages, etc
  app.use(auth.apiJWTmiddleware());
  app.use('/-/ui/', ligoWebAPI(config, auth, storage));
  // load application
  app.use('/', renderReactApp);
  return app;
};
