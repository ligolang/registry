const path = require("path");

module.exports = {
  entry: "./src/server.tsx",
  target: "node",
  mode: process.env.NODE_ENV || "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "server.bundle.js",
    path: path.resolve(__dirname),
  },
};
