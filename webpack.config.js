const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const styleLoader = {
  loader:
    process.env.NODE_ENV === 'development'
      ? 'style-loader'
      : MiniCssExtractPlugin.loader,
};

module.exports = {
  mode: process.env.NODE_ENV,
  devtool: 'source-map',
  entry: './src/main.tsx',
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    port: 3000,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        use: [{ loader: 'babel-loader' }],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [styleLoader, 'css-loader', { loader: 'postcss-loader' }],
      },
      {
        test: /\.scss$/,
        use: [
          styleLoader,
          { loader: 'css-loader' },
          { loader: 'postcss-loader' },
          {
            loader: 'resolve-url-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              implementation: require('sass'),
            },
          },
        ],
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
    new CopyWebpackPlugin({
      patterns: [{ from: 'public' }],
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        diagnosticOptions: {
          semantic: true,
          syntactic: true,
        },
      },
    }),
    new ESLintPlugin({
      extensions: ['js', 'jsx', 'ts', 'tsx'],
      failOnWarning: true,
    }),
    ...(process.env.NODE_ENV === 'production'
      ? [
          new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
            chunkFilename: '[id].[contenthash].css',
          }),
        ]
      : []),
    ...(process.env.NODE_ENV === 'development'
      ? [new ReactRefreshWebpackPlugin()]
      : []),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx'],
  },
  stats: {
    errorDetails: true,
  },
};
