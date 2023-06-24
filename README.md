# Webpack workshop

TODO: Describe what this is, why it exists and how it should be used.

## 0 - Create project with npm

```shell
npm init -y
```

## 1 - Installing webpack

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

## 2 - Basic webpack configuration

- Install the css loaders

```shell
npm i -D style-loader css-loader
```

Rename the `index.js` to `main.js`

## 3 - html-webpack-plugin

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

## 4 - dev and production builds ft. Webpack Dev Server

- Add webpack dev server

```shell
npm i -D webpack-dev-server
```

```
  devServer: {
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

- Add copy-webpack-plugin

```shell
npm i -D copy-webpack-plugin
```

- Add the plugin to the configuration

```
new CopyWebpackPlugin({
  patterns: [{ from: 'public' }],
}),
```

- Add the `public` directory

- Modify `index.html` and to this line to the `head` tag

```html
<link rel="icon" href="/favicon.ico" />
```

## 5 - webpack-bundle-analyzer

- Install the package

```shell
npm i -D webpack-bundle-analyzer
```

- Add the script to the package.json

```
"profile": "cross-env NODE_ENV=production webpack --profile --json=./dist/profile.json && webpack-bundle-analyzer ./dist/profile.json"
```

## 6 - Babel

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

## 7 - transforming imports

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

## 8 - TypeScript

- Install packages

```shell
npm i -D typescript @babel/preset-typescript fork-ts-checker-webpack-plugin
```

- Add the tsconfig.json file

- Change the webpack entry field

```
entry: './src/main.ts',
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

## 9 - React

```shell
npm i react react-dom
npm i -D @types/react @types/react-dom @babel/preset-react
npm i -D @pmmmwh/react-refresh-webpack-plugin react-refresh
```

- Add the babel preset

```
["@babel/preset-react", { "runtime": "automatic" }],
```

- Add the `react-refresh` babel plugin

```
...(process.env.NODE_ENV === 'development' ? ['react-refresh/babel'] : []),
```

- Enable full hot reloading for webpack-dev-server

```
hot: true,
```

- Add the `@pmmmwh/react-refresh-webpack-plugin` webpack plugin only in development mode

```
...(process.env.NODE_ENV === 'development'
  ? [new ReactRefreshWebpackPlugin()]
  : []),
```

- Add the jsx typescript setting

```
"jsx": "react-jsx",
```

- Change webpack config
  - change the entry setting
    ```
      entry: './src/main.tsx',
    ```
  - change the loader matcher
    ```
      test: /\.[jt]sx?$/,
    ```
  - change the resolve.extensions setting
    ```
      extensions: ['.js', '.ts', '.jsx', '.tsx' ],
    ```

## 10 - Jest & Testing Library

- Install packages

```shell
npm i -D @testing-library/dom @testing-library/react
npm i -D @testing-library/user-event @testing-library/jest-dom
npm i -D jest jest-environment-jsdom
npm i -D whatwg-fetch msw
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

- Add `__mocks__` to the typescript include field

```
  "include": ["src", "__mocks__"]
```

## 11 - Prettier

- Install the package

```shell
npm i -D prettier
```

- Add the config files

- Add the npm script

```
"fmt": "prettier --write .",
```

- Run the format script

```shell
npm run fmt
```

- Demonstrate WebStorm config
- Demonstrate VSCode config
  - https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode

```
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "prettier.useEditorConfig": true,
  "prettier.configPath": ".prettierrc"
```

## 12 - ESLint

- Install the packages

```shell
npm i -D eslint
npm i -D eslint-config-airbnb
npm i -D eslint-plugin-import
npm i -D eslint-plugin-react
npm i -D eslint-plugin-react-hooks
npm i -D eslint-plugin-jsx-a11y
npm i -D eslint-config-airbnb-typescript
npm i -D @typescript-eslint/eslint-plugin
npm i -D @typescript-eslint/parser
npm i -D eslint-plugin-eslint-comments
npm i -D eslint-import-resolver-alias
npm i -D eslint-config-prettier
npm i -D eslint-plugin-prettier
npm i -D eslint-plugin-jest
npm i -D eslint-plugin-testing-library
```

- Add the eslint config

- Add the npm scripts

```
"lint": "eslint ./ --max-warnings 0",
"lint-fix": "npm run lint -- --fix"
```

- Install the webpack plugin

```shell
npm i -D eslint-webpack-plugin
```

- Add the plugin to the webpack configuration

```
new ESLintPlugin({
  extensions: ['js', 'jsx', 'ts', 'tsx'],
  failOnWarning: true,
}),
```

- Doesn't work for test files. Why?

- Demonstrate WebStorm config
- Demonstrate VSCode config
  - https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint

```
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": ["typescript", "typescriptreact"]
```

## 13 - SCSS (OPTIONAL)

- Install the packages

```shell
npm i -D sass sass-loader resolve-url-loader
```

- Add the webpack loader

```
{
  test: /\.scss$/,
  use: [
    styleLoader,
    { loader: 'css-loader' },
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
```

## 14 - Tailwind (OPTIONAL)

- install the packages

```shell
npm i -D tailwindcss postcss postcss-loader cssnano
```

- copy the tailwind, postcss configs

- add the js config files to the eslint ignore list

```
postcss.config.js
tailwind.config.js
```

- add the postcss loader after the `css-loader`.

```
{ loader: 'postcss-loader' },
```

- add the tailwind directives on top of your css file

```
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 15 - MUI (OPTIONAL)

```shell
npm i @mui/material @emotion/react @emotion/styled @fontsource/roboto @mui/icons-material
```

- import the fonts

```
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
```

- add the MUI baseline component

```jsx
<CssBaseline />
```

