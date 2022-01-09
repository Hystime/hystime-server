/* eslint-disable @typescript-eslint/no-var-requires */
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { merge } = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const path = require('path');
const common = require('./webpack.common.js');
const WebpackBarPlugin = require('webpackbar');

// noinspection JSUnresolvedFunction,SpellCheckingInspection
module.exports = merge(common, {
  devtool: false,
  entry: [path.join(__dirname, 'src/main.ts')],
  externals: [nodeExternals()],
  mode: 'production',
  plugins: [new CleanWebpackPlugin(), new WebpackBarPlugin()],
  target: 'node',
});
