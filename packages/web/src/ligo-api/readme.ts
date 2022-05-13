import buildDebug from 'debug';
import { Router } from 'express';
import tar from 'tar';

import { IAuth } from '@verdaccio/auth';
import { HEADERS, HEADER_TYPE } from '@verdaccio/core';
import { $NextFunctionVer, $RequestExtend, $ResponseExtend, allow } from '@verdaccio/middleware';
import sanitizyReadme from '@verdaccio/readme';
import { Storage } from '@verdaccio/store';
import { Config, Package } from '@verdaccio/types';

import { AuthorAvatar, addScope, parseReadme } from '../utils/web-utils';

export { $RequestExtend, $ResponseExtend, $NextFunctionVer }; // Was required by other packages

export type PackageExt = Package & { author: AuthorAvatar; dist?: { tarball: string } };

const debug = buildDebug('verdaccio:web:api:readme');

export const NOT_README_FOUND = 'ERROR: No README data found!';

function addReadmeWebApi(config: Config, storage: Storage, auth: IAuth): Router {
  debug('initialized readme web api');
  const can = allow(auth);
  const pkgRouter = Router(); /* eslint new-cap: 0 */

  pkgRouter.get(
    '/readme/(@:scope/)?:package/:version?',
    can('access'),
    async function (
      req: $RequestExtend,
      res: $ResponseExtend,
      next: $NextFunctionVer
    ): Promise<void> {
      debug('readme hit');
      const packageName = req.params.scope
        ? addScope(req.params.scope, req.params.package)
        : req.params.package;
      debug('readme name %o', packageName);

      let infos = await storage.getPackageNext({
        name: packageName,
        req: req,
        keepUpLinkData: true,
        uplinksLook: true,
        requestOptions: {
          host: 'www.foobar.com',
          protocol: 'https', // string;
          headers: {}, // { [key: string]: string };
        },
      });

      try {
        let info = infos[0];
        // @ts-ignore
        let latestVersion = info['dist-tags'].latest;
        let version = req.params.version ?? latestVersion;
        let readmeFilename = info.versions[version].readmeFilename;
        let fs = require('fs');
        let path = require('path');
        let os = require('os');
        let rimraf = require('rimraf');
        let xPath = path.join(os.tmpdir(), `${info.name}-${version}`);

        rimraf.sync(xPath);
        fs.mkdirSync(xPath);
        await tar.x({
          C: xPath,
          file: path.join(
            config.storage,
            info.name,
            `${info.name}-${version}.tgz`
          ),
        });
        let readmePath = path.join(xPath, 'package', readmeFilename);
        let readme = fs.readFileSync(readmePath).toString();
        // @ts-ignore
        // debug(info);
        // @ts-ignore
        next({ data: readme });
        // next(parseReadme(info.name, readme));
      } catch (e) {
        debug(e);
        next(sanitizyReadme(NOT_README_FOUND));
      }
    }
  );
  return pkgRouter;
}

export default addReadmeWebApi;
