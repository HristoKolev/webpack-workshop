const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");

const styleLoader = {
  loader:
      process.env.NODE_ENV === 'development'
          ? 'style-loader'
          : MiniCssExtractPlugin.loader,
};

module.exports = {
  mode: process.env.NODE_ENV,
  entry: './src/index.js',
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    static: false,
    compress: true,
    port: 3000,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [styleLoader, 'css-loader'],
      },
      {
        test: /\.(ico|gif|png|jpg|jpeg|svg|woff|woff2|eot|ttf|otf)$/i,
        type: 'asset',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      inject: 'body',
      template: 'src/index.html',
    }),
    ...(process.env.NODE_ENV === 'production'
        ? [
          new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
            chunkFilename: '[id].[contenthash].css',
          }),
        ]
        : []),
  ],
  stats: {
    errorDetails: true,
  },
};
