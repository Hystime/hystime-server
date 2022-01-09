/* eslint-disable @typescript-eslint/no-var-requires */
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

// noinspection JSUnresolvedFunction,SpellCheckingInspection
module.exports = merge(common, {
  devtool: false,
  mode: 'production',
});
