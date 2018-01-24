/**
 * Created by joe on 16/9/6.
 */
'use strict';

let path = require('path');

module.exports = {
  entry: {
    virsical: './src/virsical.js',
    test: './src/test.js'
  },
  output: {
    path: 'lib',
    filename: '[name].js',
    libraryTarget: "umd"
  },
  module: {
    loaders: [
      {
        test: /\.(js)$/,
        loader: 'babel-loader',
        include: [path.join(__dirname, './src')]
      }
    ]
  }
};
