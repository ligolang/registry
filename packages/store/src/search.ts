/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable no-invalid-this
import buildDebug from 'debug';
import _ from 'lodash';
import { PassThrough, Transform, pipeline } from 'stream';

import { VerdaccioError } from '@verdaccio/core';
import { errorUtils, searchUtils } from '@verdaccio/core';
import { logger } from '@verdaccio/logger';
import { IProxy, ProxyList, ProxySearchParams } from '@verdaccio/proxy';
import { Version } from '@verdaccio/types';

import { LocalStorage } from './local-storage';
import { Storage } from './storage';

const debug = buildDebug('verdaccio:storage:search');
export interface ISearchResult {
  ref: string;
  score: number;
}
// @deprecated not longer used
export interface IWebSearch {
  storage: Storage;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query(query: string): ISearchResult[];
  add(pkg: Version): void;
  remove(name: string): void;
  reindex(): void;
  configureStorage(storage: Storage): void;
}

export function removeDuplicates(results: searchUtils.SearchPackageItem[]) {
  const pkgNames: any[] = [];
  const orderByResults = _.orderBy(results, ['verdaccioPrivate', 'asc']);
  return orderByResults.filter((pkg) => {
    if (pkgNames.includes(pkg?.package?.name)) {
      return false;
    }
    pkgNames.push(pkg?.package?.name);
    return true;
  });
}

class TransFormResults extends Transform {
  public constructor(options) {
    super(options);
  }

  /**
   * Transform either array of packages or a single package into a stream of packages.
   * From uplinks the chunks are array but from local packages are objects.
   * @param {string} chunk
   * @param {string} encoding
   * @param {function} done
   * @returns {void}
   * @override
   */
  public _transform(chunk, _encoding, callback) {
    if (_.isArray(chunk)) {
      // from remotes we should expect chunks as arrays
      (chunk as searchUtils.SearchItem[])
        .filter((pkgItem) => {
          debug(`streaming remote pkg name ${pkgItem?.package?.name}`);
          return true;
        })
        .forEach((pkgItem) => {
          this.push({ ...pkgItem, verdaccioPkgCached: false, verdaccioPrivate: false });
        });
      return callback();
    } else {
      // local we expect objects
      debug(`streaming local pkg name ${chunk?.package?.name}`);
      this.push(chunk);
      return callback();
    }
  }
}

export class SearchManager {
  public readonly uplinks: ProxyList;
  public readonly localStorage: LocalStorage;
  constructor(uplinks: ProxyList, storage: LocalStorage) {
    this.uplinks = uplinks;
    this.localStorage = storage;
  }

  public get proxyList() {
    const uplinksList = Object.keys(this.uplinks);

    return uplinksList;
  }

  /**
   * Handle search on packages and proxies.
   * Iterate all proxies configured and search in all endpoints in v2 and pipe all responses
   * to a stream, once the proxies request has finished search in local storage for all packages
   * (privated and cached).
   */
  public async search(options: ProxySearchParams): Promise<searchUtils.SearchPackageItem[]> {
    const transformResults = new TransFormResults({ objectMode: true });
    const streamPassThrough = new PassThrough({ objectMode: true });
    const upLinkList = this.proxyList;

    const searchUplinksStreams = upLinkList.map((uplinkId) => {
      const uplink = this.uplinks[uplinkId];
      if (!uplink) {
        // this should never tecnically happens
        logger.fatal({ uplinkId }, 'uplink @upLinkId not found');
      }
      return this.consumeSearchStream(uplinkId, uplink, options, streamPassThrough);
    });

    try {
      debug('search uplinks');
      // we only process those streams end successfully, if all fails
      // we just include local storage
      await Promise.allSettled([...searchUplinksStreams]);
      debug('search uplinks done');
    } catch (err: any) {
      logger.error({ err: err?.message }, ' error on uplinks search @{err}');
      streamPassThrough.emit('error', err);
    }
    debug('search local');
    try {
      await this.localStorage.search(streamPassThrough, options.query as searchUtils.SearchQuery);
    } catch (err: any) {
      logger.error({ err: err?.message }, ' error on local search @{err}');
      streamPassThrough.emit('error', err);
    }
    const data: searchUtils.SearchPackageItem[] = [];
    const outPutStream = new PassThrough({ objectMode: true });
    pipeline(streamPassThrough, transformResults, outPutStream, (err) => {
      if (err) {
        throw errorUtils.getInternalError(err ? err.message : 'unknown error');
      } else {
        debug('pipeline succeeded');
      }
    });

    outPutStream.on('data', (chunk) => {
      data.push(chunk);
    });

    return new Promise((resolve) => {
      outPutStream.on('finish', async () => {
        const searchFinalResults: searchUtils.SearchPackageItem[] = removeDuplicates(data);
        debug('search stream total results: %o', searchFinalResults.length);
        return resolve(searchFinalResults);
      });
      debug('search done');
    });
  }

  /**
   * Consume the upstream and pipe it to a transformable stream.
   */
  private consumeSearchStream(
    uplinkId: string,
    uplink: IProxy,
    options: ProxySearchParams,
    searchPassThrough: PassThrough
  ): Promise<any> {
    return uplink.search({ ...options }).then((bodyStream) => {
      bodyStream.pipe(searchPassThrough, { end: false });
      bodyStream.on('error', (err: VerdaccioError): void => {
        logger.error(
          { uplinkId, err: err },
          'search error for uplink @{uplinkId}: @{err?.message}'
        );
        searchPassThrough.end();
      });
      return new Promise((resolve) => bodyStream.on('end', resolve));
    });
  }
}
