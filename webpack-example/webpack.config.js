const path = require("path")
const webpack = require("webpack")

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  },
  resolve: {
    mainFields: ["main", "module"],
  },
  plugins: [new webpack.IgnorePlugin(/moment$/)],
}
