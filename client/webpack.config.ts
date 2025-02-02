import * as path from 'path';
import * as webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import ReactFastRefreshPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import 'webpack-dev-server';
import dotenv from 'dotenv';

dotenv.config();

const isProd = process.env.NODE_ENV === 'production';

const mode = isProd ? 'production' : 'development';

const filename = (ext: string) =>
  isProd ? `[name].[contenthash].${ext}` : `[name].${ext}`;

const config: webpack.Configuration = {
  mode,
  entry: './src/index.tsx',
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    assetModuleFilename: 'images/[hash][ext][query]',
    clean: true,
  },
  devServer: {
    static: './dist',
    historyApiFallback: true,
    hot: true,
  },
  devtool: 'source-map',

  plugins: [
    new webpack.DefinePlugin({
      'process.env.API_BASE_URL': JSON.stringify(process.env.API_BASE_URL),
    }),
    new MiniCssExtractPlugin({
      filename: filename('css'),
    }),
    new HTMLWebpackPlugin({
      template: './src/assets/template.html',
      hash: true,
      favicon: './src/assets/images/favicon.ico',
    }),
    new ReactFastRefreshPlugin(),
  ],

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },

  module: {
    rules: [
      {
        test: /\.(png|jpe?g|svg|gif)$/i,
        type: 'asset',
      },
      {
        test: /\.(s[ac]|c)ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(j|t)sx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'swc-loader',
        },
      },
    ],
  },

  optimization: {
    moduleIds: 'deterministic',
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
};

export default config;
