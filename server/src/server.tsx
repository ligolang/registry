import http from "http";
import path from "path";
import debug from "debug";
import express from "express";
import bodyParser from "body-parser";
import api from "./api";
import react from "./react";

let log = debug("app");

const app = express();
const port = 4000;

app.get("/manifest.json", express.static(process.env.CRA_BUILD_DIR!));
app.use(
  "/icons",
  express.static(path.join(process.env.CRA_BUILD_DIR!, "icons"))
);
app.get("/logo.svg", express.static(process.env.CRA_BUILD_DIR!));
app.get("/favicon.svg", express.static(process.env.CRA_BUILD_DIR!));
app.use(
  "/static",
  express.static(path.join(process.env.CRA_BUILD_DIR!, "static"))
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/api", api);
app.use("*", react);

app.listen(port, () => {
  log(`Running on ${port}`);
});
