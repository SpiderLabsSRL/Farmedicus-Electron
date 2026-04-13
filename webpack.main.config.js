const path = require("path");
const { rules } = require("./webpack.rules");
const { plugins } = require("./webpack.plugins");

module.exports = {
  mode: "development",
  entry: "./src/main.ts",
  target: "electron-main",

  module: {
    rules,
  },

  plugins,

  resolve: {
    extensions: [".ts", ".js", ".json"],
  },

  output: {
    filename: "index.js",
    path: path.resolve(__dirname, ".webpack/main"),
  },

  node: {
    __dirname: false,
    __filename: false,
  },
};
