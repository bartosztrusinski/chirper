const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");

const mode =
  process.env.NODE_ENV === "production" ? "production" : "development";

const filename = (ext) =>
  mode === "production" ? `[name].[contenthash].${ext}` : `[name].${ext}`;

module.exports = {
  mode,
  entry: "./src/index.js",
  output: {
    filename: filename("js"),
    path: path.resolve(__dirname, "dist"),
    assetModuleFilename: "images/[hash][ext][query]",
    clean: true,
  },
  devServer: {
    static: "./dist",
    hot: true,
  },
  devtool: "source-map",

  plugins: [
    new MiniCssExtractPlugin({
      filename: filename("css"),
    }),
    new HTMLWebpackPlugin({
      template: "./src/index.html",
      hash: true,
    }),
  ],

  resolve: {
    extensions: [".js", ".jsx"],
  },

  module: {
    rules: [
      {
        test: /\.(png|jpe?g|svg|gif)$/i,
        type: "asset",
      },
      {
        test: /\.(s[ac]|c)ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: "swc-loader",
        },
      },
    ],
  },
};
