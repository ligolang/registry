import { ReactSSR } from '@ligo-registry/ui';
import buildDebug from 'debug';
import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import URL from 'url';

const debug = buildDebug('verdaccio:web:render:react-ssr');

let react = express.Router();
react.get('*', function (request, response) {
  let buildDir = process.env.CRA_BUILD_DIR!;
  fs.readFile(path.join(buildDir, 'index.html')).then(function (buf) {
    ReactSSR.resolve(URL.parse(request.originalUrl).pathname!)
      .then((html: string) => {
        response
          .status(200)
          .setHeader('Content-type', 'text/html')
          .end(
            buf
              .toString()
              .replace(
                `<div id="root" class="h-full overflow-scroll"></div>`,
                `<div id="root" class="h-full overflow-scroll">${html}</div>`
              )
          );
      })
      .catch((e: Error) => {
        debug(`Caught in react express router while resolving ${request.originalUrl}`, e);
        debug(e.message);
        debug(JSON.stringify(e));
        // @ts-ignore
        response.status(e.status).end();
      });
  });
});

export default react;
