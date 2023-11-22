const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const IS_PROD = process.env.NODE_ENV === 'production';

const optimization = {
  minimize: IS_PROD,
  minimizer: [
    new TerserPlugin({
      extractComments: false,
      terserOptions: {
        ie8: false,
        ecma: 8,
        output: {
          comments: false,
          beautify: false
        },
        compress: {
          drop_console: false
        },
        warnings: false,
        keep_classnames: true,
        keep_fnames: true
      }
    })
  ]
};

const rules = [{
  test: /\.(tsx?)$/,
  use: [{
    loader: 'ts-loader'
  }]
}];

module.exports = {
  devServer: {
    hot: !IS_PROD,
    static: './app',
    host: '0.0.0.0'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  entry: {
    'index': ['./src/index.ts']
  },
  output: {
    path: path.join(__dirname, './app'),
    publicPath: '/',
    filename: './[name].js',
    library: 'appLibrary',
    libraryTarget: 'umd',
    chunkFilename: './index.js',
    globalObject: 'this'
  },
  plugins: [],
  optimization,
  module: {
    rules
  },
  performance: {
    hints: false
  },
  devtool: false,
  mode: IS_PROD ? 'production' : 'development'
};
