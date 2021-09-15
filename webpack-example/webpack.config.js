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
    alias: {
      bokehjs: path.resolve(
        __dirname,
        "node_modules/@bokeh/bokehjs/build/js/lib"
      )
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        loader: "babel-loader",
        include: /static\/js/,
        exclude: /node_modules/,
      },
      {
        test: /\.js?$/,
        include: /node_modules\/@bokeh/,
        use: [
          {
            loader: "babel-loader",
            options: {
              plugins: [
                "@babel/plugin-proposal-export-namespace-from",
                "@babel/plugin-proposal-optional-chaining",
                "@babel/plugin-proposal-nullish-coalescing-operator"
              ],
            },
          }
        ]
      }
    ]
  },
  plugins: [new webpack.IgnorePlugin(/moment$/)],
}
