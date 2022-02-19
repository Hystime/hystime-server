const { merge } = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const common = require('./webpack.common.js');
const path = require('path');
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');
const { HotModuleReplacementPlugin } = require('webpack');

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
  entry: ['webpack/hot/poll?1000'],
  externals: [
    nodeExternals({
      allowlist: ['webpack/hot/poll?1000'],
    }),
  ],
  plugins: [
    new RunScriptWebpackPlugin({
      name: 'server.js',
    }),
    new HotModuleReplacementPlugin(),
  ],
  devServer: {
    static: path.join(__dirname, 'dist'),
    hot: true,
  },
  mode: 'development',
  watch: true,
});
