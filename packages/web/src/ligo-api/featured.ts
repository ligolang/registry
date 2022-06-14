import buildDebug from 'debug';
import { Router } from 'express';
import { promises as fs } from 'fs';
import fetch from 'node-fetch';

import { IAuth } from '@verdaccio/auth';
import { errorUtils } from '@verdaccio/core';
import { $NextFunctionVer, $RequestExtend, $ResponseExtend, allow } from '@verdaccio/middleware';
import { Storage } from '@verdaccio/store';
import { Config, Package, Version } from '@verdaccio/types';

import { AuthorAvatar } from '../utils/web-utils';

export { $RequestExtend, $ResponseExtend, $NextFunctionVer }; // Was required by other packages

export type PackageExt = Package & { author: AuthorAvatar; dist?: { tarball: string } };

export type $SidebarPackage = Package & { latest: Version };
const debug = buildDebug('verdaccio:web:api:sidebar');

const defaultFeaturedPackagesSource =
  'https://raw.githubusercontent.com/callistonianembrace/ligo-featured-packages/main/index.json';
function fetchFeaturedPackages(): Promise<string[]> {
  let { FEATURED_PACKAGES_SOURCE } = process.env;
  if (FEATURED_PACKAGES_SOURCE) {
    debug('FEATURED_PACKAGES_SOURCE as found in the environment', FEATURED_PACKAGES_SOURCE);
    if (FEATURED_PACKAGES_SOURCE.startsWith('http')) {
      debug('Fetching', FEATURED_PACKAGES_SOURCE, 'via http');
      return fetch(FEATURED_PACKAGES_SOURCE).then((r) => r.json());
    } else {
      debug('Reading', FEATURED_PACKAGES_SOURCE, 'via fs');
      return fs.readFile(FEATURED_PACKAGES_SOURCE).then((c) => JSON.parse(c.toString()));
    }
  } else {
    debug(
      'No FEATURED_PACKAGES_SOURCE in environment. Using the default',
      defaultFeaturedPackagesSource
    );
    return fetch(defaultFeaturedPackagesSource).then((r) => r.json());
  }
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
        debug('featuredPackageslist', featuredPackagesList);
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

        next(featuredPackages.flat().filter((x) => x !== null));
      } catch (err: any) {
        next(errorUtils.getInternalError(err.message));
      }
    }
  );

  return router;
}

export default addFeatureWebApi;
