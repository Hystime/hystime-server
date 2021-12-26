/* eslint-disable @typescript-eslint/no-var-requires */
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackBar = require('webpackbar');
const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        exclude: path.resolve(__dirname, 'node_modules'),
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.prod.json',
              transpileOnly: true,
            },
          },
        ],
      },
      {
        exclude: path.resolve(__dirname, 'node_modules'),
        test: /\.graphql?$/,
        use: [
          {
            loader: 'webpack-graphql-loader',
            options: {
              output: 'string',
              minify: false,
            },
          },
        ],
      },
    ],
  },
  devtool: false,
  entry: [path.join(__dirname, 'src/main.ts')],
  mode: 'none',
  plugins: [new CleanWebpackPlugin(), new WebpackBar()],
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'dist'),
    pathinfo: true,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  target: 'node',
};
