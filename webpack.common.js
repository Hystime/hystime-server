const path = require('path');
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
  resolve: {
    extensions: ['.ts', '.js'],
  },
  target: 'node',
  plugins: [new CleanWebpackPlugin(), new WebpackBarPlugin()],
};
