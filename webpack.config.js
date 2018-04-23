const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

// Config directories. MUST include / on the end.
const SRC_DIR = path.resolve(__dirname, 'src') + path.sep;
const OUTPUT_DIR = path.resolve(__dirname, 'dist') + path.sep;

// Default entry file
const ENTRY = path.resolve(SRC_DIR, 'index.js');
// Default HTML output file
const HTML_FILE = path.resolve(OUTPUT_DIR, 'index.html')
// Normal include dirs for rules
const INCLUDE_DIRS = [SRC_DIR];


module.exports = env => {
  return {
    mode: env.NODE_ENV,
    entry: ENTRY,
    // This is where everything will be output
    output: {
      path: OUTPUT_DIR,
      filename: 'bundle.js'
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['css-loader', 'style-loader'],
          include: INCLUDE_DIRS,
        },
        {
          test: /\.jsx?$/,
          use: [{ loader: 'babel-loader' }],
          exclude: path.resolve(__dirname, 'node_modules'),
          include: INCLUDE_DIRS,
        },
        {
          test: /\.(jpe?g|png|gif)$/,
          use: [{ loader: 'file-loader?name=img/[name]__[hash:base64:5].[ext]' }],
          include: INCLUDE_DIRS,
        },
        {
          test: /\.(eot|svg|ttf|woff|woff2)$/,
          use: [{ loader: 'file-loader?name=font/[name]__[hash:base64:5].[ext]' }],
          include: INCLUDE_DIRS,
        }
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'FaceRekt',
        filename: HTML_FILE,
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV),
        'MOCK': JSON.stringify(env.MOCK === 'true'),
      }),
    ],
    // This is used for webpack-dev-server
    devServer: {
      // contentBase: common.OUTPUT_DIR,
      compress: true,
      port: 8000
    },
    // These change what stats are printed 
    stats: {
      colors: true,
      children: false,
      chunks: false,
      modules: false
    }
  }
};
