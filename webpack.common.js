const path = require('path');

// Config directories
const SRC_DIR = path.resolve(__dirname, 'src');
const OUTPUT_DIR = path.resolve(__dirname, 'dist');

// Default entry file
const ENTRY = path.resolve(SRC_DIR, 'index.js');
// Default output settings
const OUTPUT = {
  path: OUTPUT_DIR,
  publicPath: './',
  filename: 'bundle.js'
};
// Default HTML output file
const HTML_FILE = path.resolve(OUTPUT_DIR, 'index.html')

// Change display stats
const STATS = {
  colors: true,
  children: false,
  chunks: false,
  modules: false
};

function rules(opts) {
  let includeDir = opts.include
  return [
    {
      test: /\.css$/,
      use: ['css-loader', 'style-loader'],
      include: includeDir
    },
    {
      test: /\.jsx?$/,
      use: [{ loader: 'babel-loader' }],
      include: includeDir
    },
    {
      test: /\.(jpe?g|png|gif)$/,
      use: [{ loader: 'file-loader?name=img/[name]__[hash:base64:5].[ext]' }],
      include: includeDir
    },
    {
      test: /\.(eot|svg|ttf|woff|woff2)$/,
      use: [{ loader: 'file-loader?name=font/[name]__[hash:base64:5].[ext]' }],
      include: includeDir
    }
  ];
}

module.exports = {
  rules: rules,
  SRC_DIR: SRC_DIR,
  OUTPUT_DIR: OUTPUT_DIR,
  ENTRY: ENTRY,
  OUTPUT: OUTPUT,
  HTML_FILE: HTML_FILE,
  STATS: STATS,
};
