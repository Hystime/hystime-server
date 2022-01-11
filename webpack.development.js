/* eslint-disable @typescript-eslint/no-var-requires */
const { merge } = require('webpack-merge');

const common = require('./webpack.common.js');
const path = require('path');

// noinspection JSCheckFunctionSignatures
module.exports = merge(common, {
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        exclude: path.resolve(__dirname, 'node_modules'),
        test: /\.ts$/,
        loader: 'ts-loader',
      },
    ],
  },
  mode: 'development',
  watch: true,
});
