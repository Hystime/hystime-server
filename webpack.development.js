/* eslint-disable @typescript-eslint/no-var-requires */
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { merge } = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
const webpack = require('webpack');

const common = require('./webpack.common.js');

module.exports = merge(common, {
  devtool: 'inline-source-map',
  entry: [path.join(__dirname, 'src/main.ts')],
  externals: [nodeExternals()],
  mode: 'development',
  plugins: [new CleanWebpackPlugin()],
  watch: true,
});
