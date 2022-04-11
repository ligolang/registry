# Registry

A web app tracking Ligo packages

## Project structure

We use Yarn workspaces to organise the web app into two npm packages -
`@ligo-registry/server` and `@ligo-registry/client` (namespace not
finalised and could change).

`@ligo-registry/client` (present in the `client`) is bootstrapped with
[Create React App](https://create-react-app.dev/). However,
`react-scripts` from CRA doesn't suffice our needs - we need to expose
certain functions from the client side to the server.

We vendored `react-scripts` from CRA, and added a new task, `tsc`, to
transpile the components and other isomorphic business logic from the
client side codebase, for use on the server.

## Build instructions

To build client side assets (JS/CSS etc)

```sh
cd client && yarn build
```

To build server side entry (`server.bundle.js`)

```
cd server && yarn build
```

We had to bundle server scripts into one entry point to avoid,

```
ERR_REQUIRE_ESM]: require() of ES Module from not supported. Instead
change the require of index.js in... to a dynamic import() which is
available in all CommonJS modules.
```

## Instructions to run the server

The server expects `CRA_BUILD_DIR` environment variable, which must
contain the full path the the build directory created from `yarn
build` step of the client.

Example,

```sh
CRA_BUILD_DIR=/path/to/source/client/build node server.bundle.js
```

For development, there's `nodemon`

```sh
CRA_BUILD_DIR=/path/to/source/client/build yarn nodemon server.bundle.js
# or
CRA_BUILD_DIR=/path/to/source/client/build yarn start
```
