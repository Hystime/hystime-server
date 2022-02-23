const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
  devtool: 'source-map',
  entry: [path.join(__dirname, 'src/api.ts')],
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'api'),
  },
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
  mode: 'production',
});
