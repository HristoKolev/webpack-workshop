# 0 - Create project with npm

```shell
npm init -y

```

# 1 - Install webpack

```shell
npm i webpack webpack-cli -D
```

* Install some library from npm that you want to use.

```shell
npm i date-fns
```

* Add the build script to `package.json`

```
"build": "webpack"
```

# 2 - Add basic webpack configuration

* Install the css loaders

```shell
npm i -D style-loader css-loader
```

# 3 - Add html-webpack-plugin

* Install the package

```shell
npm i -D html-webpack-plugin
```

* Add the plugin to the webpack plugins section

```js
new HtmlWebpackPlugin({
  filename: 'index.html',
  inject: 'body',
  template: 'src/index.html',
})
```

* Remove the script tag from the html file and move the file to the `src` directory.

* You can also add hashing to the output file names:
 
```
'[name].[contenthash].js'
```

# 4 - dev and production builds ft. Webpack Dev Server

* Add webpack dev server

```shell
npm i -D webpack-dev-server
```

```
  devServer: {
    static: false,
    compress: true,
    port: 3000,
  },
```

* Add the start script

```
"start": "webpack serve",
```

* Install cross-env

```shell
npm i -D cross-env 
```

* Change the scripts to include the env variable.

```
    "start": "cross-env NODE_ENV=development webpack serve",
    "build": "cross-env NODE_ENV=production webpack"
```

* Add the mode config

```
mode: process.env.NODE_ENV,
```

* Install mini-css-extract-plugin

```shell
npm i -D mini-css-extract-plugin
```

* Add the the loader to the production configuration

```
const styleLoader = {
  loader:
    process.env.NODE_ENV === 'development'
      ? 'style-loader'
      : MiniCssExtractPlugin.loader,
};

```

* Add the plugin to the production configuration

```
...(process.env.NODE_ENV === 'production'
        ? [
          new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
            chunkFilename: '[id].[contenthash].css',
          }),
        ]
        : []),
```

* Install clean-webpack-plugin
 
```shell
npm i -D clean-webpack-plugin
```

* Add the plugin to the configuration

```
new CleanWebpackPlugin(),
```

# 5 - webpack-bundle-analyzer

* Install the package

```shell
npm i -D webpack-bundle-analyzer
```

* Add the script to the package.json

```
"profile": "cross-env NODE_ENV=production webpack --profile --json=./dist/profile.json && webpack-bundle-analyzer ./dist/profile.json"
```