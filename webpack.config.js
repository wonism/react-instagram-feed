const path = require('path');
const webpack = require('webpack');

const isProduction = process.env.NODE_ENV === 'production';

const productionPlugins = [];
const developmentPlugins = [
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin(),
];
const externals = isProduction ? {
  "fetchInstagram": true,
  "react": true,
  "react-dom": true,
} : {
  "fetchInstagram": true,
};

const plugins = [
  new webpack.DefinePlugin({
    process: {
      env: {
        NODE_ENV: JSON.stringify(isProduction ? 'production' : 'development'),
      },
    },
  }),
].concat(isProduction ?
  productionPlugins :
  developmentPlugins
);

const config = {
  mode: isProduction ? 'production' : 'development',
  entry: path.resolve(__dirname, isProduction ? 'src' : 'demo', 'index.jsx'),
  devServer: {
    contentBase: path.resolve('demo'),
    hot: true,
    inline: true,
    port: 7777,
    historyApiFallback: true,
    compress: false,
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'react-instagram-feed.js',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      'node_modules',
      path.resolve(__dirname, 'src'),
    ],
  },
  plugins,
  optimization: {
    minimize: !isProduction,
  },
  module: {
    rules: [{
      enforce: 'pre',
      test: /\.jsx?$/,
      loader: 'eslint-loader',
      include: path.resolve(__dirname, 'src'),
      options: {
        failOnWarning: true,
        failOnError: true,
        emitWarning: true,
      },
    }, {
      test: /\.jsx?$/,
      use: 'babel-loader',
      exclude: /node_modules|bower_components/,
    }],
  },
  externals,
  devtool: isProduction ? false : 'eval-source-map',
};

module.exports = config;
