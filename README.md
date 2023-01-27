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
