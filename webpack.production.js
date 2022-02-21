const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = merge(common, {
  devtool: 'source-map',
  module: {
    rules: [
      {
        exclude: path.resolve(__dirname, 'node_modules'),
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          configFile: 'tsconfig.prod.json',
          transpileOnly: true,
        },
      },
    ],
  },
  externals: [nodeExternals()],
  mode: 'production',
});
