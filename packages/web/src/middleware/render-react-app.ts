import express from "express";
import URL from "url";
import { promises as fs } from "fs";
import path from "path";
import { ReactSSR } from "@ligo-registry/ui";

let react = express.Router();
react.get("*", function (request, response) {
  let buildDir = process.env.CRA_BUILD_DIR!;
  fs.readFile(path.join(buildDir, "index.html")).then(function (buf) {
    ReactSSR.resolve(URL.parse(request.originalUrl).pathname!)
      .then((html: string) => {
        response
          .status(200)
          .setHeader("Content-type", "text/html")
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
        console.error("Caught in react express router", e);
        // @ts-ignore
        response.status(e.status).end();
      });
  });
});

export default react;
