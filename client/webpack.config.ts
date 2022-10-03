import * as path from "path";
import * as webpack from "webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import HTMLWebpackPlugin from "html-webpack-plugin";
import ReactFastRefreshPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import "webpack-dev-server";

const isProd = process.env.NODE_ENV === "production";

const mode = isProd ? "production" : "development";

const filename = (ext: string) =>
  isProd ? `[name].[contenthash].${ext}` : `[name].${ext}`;

const config: webpack.Configuration = {
  mode,
  entry: "./src/index.tsx",
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
    new ReactFastRefreshPlugin(),
  ],

  resolve: {
    extensions: [".tx", ".tsx", ".js", ".jsx"],
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
        test: /\.(j|t)sx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: "swc-loader",
        },
      },
    ],
  },
};

export default config;
