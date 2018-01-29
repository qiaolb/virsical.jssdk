/**
 * Created by joe on 16/9/6.
 */
'use strict';

let path = require('path');
let webpack = require('webpack');

module.exports = {
  entry: {
    virsical: './src/virsical.js',
    test: './src/test.js'
  },
  output: {
    path: 'lib',
    filename: '[name].js',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      {
        test: /\.(js)$/,
        loader: 'babel-loader',
        include: [path.join(__dirname, './src')]
      }
    ]
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.NoErrorsPlugin(),
  ]
};
