/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-file @typescript-eslint/no-var-requires
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackBarPlugin = require('webpackbar');

module.exports = {
  module: {
    rules: [
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
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  target: 'node',
  entry: [path.join(__dirname, 'src/main.ts')],
  externals: [nodeExternals()],
  plugins: [new CleanWebpackPlugin(), new WebpackBarPlugin()],
};
