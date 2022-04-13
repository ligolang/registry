//https://stackoverflow.com/a/69331469
// import { RequestInfo, RequestInit } from "node-fetch";
// const fetch = (url: RequestInfo, init?: RequestInit) =>  import("node-fetch").then(({ default: fetch }) => fetch(url, init));
import fetch from "node-fetch";
import express from "express";
import { promises as fs } from "fs";
import * as fsDefault from "fs";
import os from "os";
import path from "path";
import tar from "tar";
import validateNpmPackageName from "validate-npm-package-name";

let fsExists = (path: string) => {
  return fs.access(path, fsDefault.constants.F_OK).then(
    () => true,
    () => false
  );
};

let api = express.Router();
api.get(
  "/search",
  function (
    request: express.Request<
      { query: string },
      any,
      { query: string },
      { query: string },
      Record<string, null>
    >,
    response: express.Response
  ) {
    let { query } = request.query;
    if (!query) {
      response.status(400).json({ message: "Package name empty" });
      return;
    }
    query = decodeURIComponent(query);
    return fetch(`https://registry.npmjs.cf/-/v1/search?text=${query}`)
      .then((r) => r.json())
      .then(({ objects }) => response.status(200).json(objects));
  }
);

api.get(
  "/readme",
  function (
    request: express.Request<
      { packageName: string },
      any,
      { packageName: string },
      { packageName: string },
      Record<string, null>
    >,
    response: express.Response
  ) {
    let { packageName } = request.query;
    if (!packageName) {
      response.status(400).json({ message: "Package name empty" });
      return;
    }
    let { validForNewPackages, warnings } = validateNpmPackageName(packageName);
    if (validForNewPackages) {
      let encodedPackageName = packageName
        .replace("@", "__AT__")
        .replace("/", "__s__");
      return fetch(
        `https://registry.npmjs.org/-/package/${packageName}/dist-tags`
      )
        .then((r) => r.json())
        .then(({ latest }) => {
          let downloadPath = path.join(
            os.tmpdir(),
            `${encodedPackageName}-${latest}.tgz`
          );
          let parts = packageName.split("/");
          let packageNameSansNamespace = parts.length > 1 ? parts[1] : parts[0];
          return fetch(
            `https://registry.npmjs.org/${packageName}/-/${packageNameSansNamespace}-${latest}.tgz`
          )
            .then((r) => r.arrayBuffer())
            .then((arrayBuffer) =>
              fs.writeFile(downloadPath, Buffer.from(arrayBuffer))
            )
            .then(() => {
              let downloadFolder = path.join(
                os.tmpdir(),
                `${encodedPackageName}-${latest}`
              );
              return fs
                .mkdir(downloadFolder, { recursive: true })
                .then(() => {
                  return tar.x({
                    file: downloadPath,
                    cwd: downloadFolder,
                    sync: true,
                  });
                })
                .then(() => {
                  let readmePath = path.join(
                    downloadFolder,
                    "package",
                    "Readme.md"
                  );
                  return fsExists(readmePath).then((exists) =>
                    exists ? readmePath : ""
                  );
                })
                .then((readmePath) => {
                  if (readmePath !== "") {
                    return readmePath;
                  } else {
                    let readmePath = path.join(
                      downloadFolder,
                      "package",
                      "README.md"
                    );

                    return fsExists(readmePath).then((exists) =>
                      exists ? readmePath : ""
                    );
                  }
                })
                .then((readmePath) => {
                  if (readmePath !== "") {
                    return fs.readFile(readmePath).then((buf) =>
                      response.status(200).json({
                        data: buf.toString(),
                      })
                    );
                  } else {
                    response.status(404).json({ message: "Not found" });
                  }
                });
            });
        });
    } else {
      return Promise.reject(warnings);
    }
  }
);

export default api;
