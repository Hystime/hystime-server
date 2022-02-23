const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackBarPlugin = require('webpackbar');

module.exports = {
  resolve: {
    extensions: ['.ts', '.js'],
  },
  target: 'node',
  plugins: [new CleanWebpackPlugin(), new WebpackBarPlugin()],
};
