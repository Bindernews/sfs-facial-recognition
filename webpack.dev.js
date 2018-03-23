const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const common = require('./webpack.common');
const MODE = "development"

module.exports = {
  mode: MODE,
  entry: common.ENTRY,
  output: common.OUTPUT,
  module: {
    rules: common.rules({
      include: [common.SRC_DIR]
    })
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'FaceRekt',
      filename: common.HTML_FILE,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(MODE)
    })
  ],
  devServer: {
    // contentBase: common.OUTPUT_DIR,
    compress: true,
    port: 8080
  },
  stats: common.STATS
};
