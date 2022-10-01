const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const mode =
  process.env.NODE_ENV === "production" ? "production" : "development";

module.exports = {
  mode,
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    static: "./dist",
    hot: true,
  },
  devtool: "source-map",

  plugins: [new MiniCssExtractPlugin()],

  resolve: {
    extensions: [".js", ".jsx"],
  },

  module: {
    rules: [
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
