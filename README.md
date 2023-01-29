# 0 - Create project with npm

```shell
npm init -y

```

# 1 - Install webpack

```shell
npm i webpack webpack-cli -D
```

- Install some library from npm that you want to use.

```shell
npm i date-fns
```

- Add the build script to `package.json`

```
"build": "webpack"
```

# 2 - Add basic webpack configuration

- Install the css loaders

```shell
npm i -D style-loader css-loader
```

# 3 - Add html-webpack-plugin

- Install the package

```shell
npm i -D html-webpack-plugin
```

- Add the plugin to the webpack plugins section

```js
new HtmlWebpackPlugin({
  filename: 'index.html',
  inject: 'body',
  template: 'src/index.html',
});
```

- Remove the script tag from the html file and move the file to the `src` directory.

- You can also add hashing to the output file names:

```
'[name].[contenthash].js'
```

# 4 - dev and production builds ft. Webpack Dev Server

- Add webpack dev server

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

- Add the start script

```
"start": "webpack serve",
```

- Install cross-env

```shell
npm i -D cross-env
```

- Change the scripts to include the env variable.

```
    "start": "cross-env NODE_ENV=development webpack serve",
    "build": "cross-env NODE_ENV=production webpack"
```

- Add the mode config

```
mode: process.env.NODE_ENV,
```

- Install mini-css-extract-plugin

```shell
npm i -D mini-css-extract-plugin
```

- Add the the loader to the production configuration

```
const styleLoader = {
  loader:
    process.env.NODE_ENV === 'development'
      ? 'style-loader'
      : MiniCssExtractPlugin.loader,
};

```

- Add the plugin to the production configuration

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

- Install clean-webpack-plugin

```shell
npm i -D clean-webpack-plugin
```

- Add the plugin to the configuration

```
new CleanWebpackPlugin(),
```

# 5 - webpack-bundle-analyzer

- Install the package

```shell
npm i -D webpack-bundle-analyzer
```

- Add the script to the package.json

```
"profile": "cross-env NODE_ENV=production webpack --profile --json=./dist/profile.json && webpack-bundle-analyzer ./dist/profile.json"
```

# 6 - Add babel

- Install the packages

```shell
npm i -D babel-loader @babel/core @babel/preset-env core-js
```

- Add the config files

- Add the loader to the webpack config

```
  {
    test: /\.js$/,
    use: [
      { loader: 'babel-loader' }
    ],
    exclude: /node_modules/,
  },
```

- Add sourcemaps

```
devtool: 'source-map',
```

# 7 - Transforming imports

- Add the package

```shell
npm i -D babel-plugin-module-resolver
```

- Add the config to the babel config

```
[
  "module-resolver",
  {
    "root": ["./src"],
    "alias": {
      "^~(.*)": "./src/\\1",
      "^src/(.*)": "./src/\\1"
    }
  }
]
```

# 8 - Adding TypeScript

- Install packages

```shell
npm i -D typescript @babel/preset-typescript fork-ts-checker-webpack-plugin
```

- Add the tsconfig.json file

- Change the webpack entry field

```
entry: './src/index.ts',
```

- Add the webpack resolve configuration

```
  resolve: {
    extensions: ['.js', '.ts' ],
  },
```

- Add the configuration to the webpack loader

```
test: /\.[jt]s$/,
```

- Add the babel configuration

```
"@babel/preset-typescript"
```

- Add the typescript plugin to webpack

```
new ForkTsCheckerWebpackPlugin({
  typescript: {
    diagnosticOptions: {
      semantic: true,
      syntactic: true,
    },
  },
}),
```

# 9 - Adding React

```shell
npm i react react-dom
npm i -D @types/react @types/react-dom @babel/preset-react
```

- Add the babel preset

```
["@babel/preset-react", { "runtime": "automatic" }],
```

- Add the jsx typescript setting

```
"jsx": "react-jsx",
```

- Change webpack config
  - change the entry setting
    ```
      entry: './src/index.tsx',
    ```
  - change the loader matcher
    ```
      test: /\.[jt]sx?$/,
    ```
  - change the resolve.extensions setting
    ```
      extensions: ['.js', '.ts', '.jsx', '.tsx' ],
    ```

# 10 - React Testing Library + Jest

- Install packages

```shell
npm i -D @testing-library/dom @testing-library/react
npm i -D @testing-library/user-event @testing-library/jest-dom
npm i -D jest jest-environment-jsdom
npm i -D node-fetch@2 msw identity-obj-proxy
```

- Add the config files

- Add the npm script

```
"test": "cross-env NODE_ENV=test jest",
```

- Add a line to gitignore

```
coverage/
```

- Add **mocks** to the typescript include field

```
  "include": ["src", "__mocks__"]
```

# 11 - prettier

- Install the package

```shell
npm i -D prettier
```

- Add the config files

- Demonstrate WebStorm config
- Demonstrate VSCode config
  - https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode

```
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "prettier.useEditorConfig": true,
  "prettier.configPath": ".prettierrc"
```
