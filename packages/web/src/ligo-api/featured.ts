import buildDebug from 'debug';
import { Router } from 'express';
import _ from 'lodash';

import { IAuth } from '@verdaccio/auth';
import { errorUtils } from '@verdaccio/core';
import { DIST_TAGS, HTTP_STATUS } from '@verdaccio/core';
import { $NextFunctionVer, $RequestExtend, $ResponseExtend, allow } from '@verdaccio/middleware';
import { Storage } from '@verdaccio/store';
import { convertDistRemoteToLocalTarballUrls } from '@verdaccio/tarball';
import { Config, Package, Version } from '@verdaccio/types';
import { addGravatarSupport, formatAuthor, isVersionValid } from '@verdaccio/utils';

import { AuthorAvatar, addScope, deleteProperties } from '../utils/web-utils';

export { $RequestExtend, $ResponseExtend, $NextFunctionVer }; // Was required by other packages

export type PackageExt = Package & { author: AuthorAvatar; dist?: { tarball: string } };

export type $SidebarPackage = Package & { latest: Version };
const debug = buildDebug('verdaccio:web:api:sidebar');

function fetchFeaturedPackages(): Promise<string[]> {
  return fetch(
    'https://raw.githubusercontent.com/callistonianembrace/ligo-featured-packages/main/index.json'
  ).then((r) => r.json());
}

function addFeatureWebApi(config: Config, storage: Storage, auth: IAuth): Router {
  debug('initialized featured web api');
  const router = Router(); /* eslint new-cap: 0 */
  const can = allow(auth);
  // Get package readme
  router.get(
    '/featured',
    can('access'),
    async function (
      req: $RequestExtend,
      res: $ResponseExtend,
      next: $NextFunctionVer
    ): Promise<void> {
      try {
        let featuredPackagesList = await fetchFeaturedPackages();
        let featuredPackages = await Promise.all(
          featuredPackagesList.map((featuredPackage) =>
            storage.getPackageNext({
              name: featuredPackage,
              req: req,
              keepUpLinkData: false,
              uplinksLook: false,
              requestOptions: {
                host: 'www.foobar.com',
                protocol: 'https', // string;
                headers: {}, // { [key: string]: string };
              },
            })
          )
        );

        next(featuredPackages.flat().filter(x => x !== null));
      } catch (err: any) {
        next(errorUtils.getInternalError(err.message));
      }
    }
  );

  return router;
}

export default addFeatureWebApi;
