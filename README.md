# Webpack workshop

TODO: Describe what this is, why it exists and how it should be used.

## 0 - NPM package

- Initialize the package

```shell
npm init -y
```

- Open `package.json`.

- Remove every property except `name`, `version`, `scripts`.

- Insert the `private` property with value `true` after the `version` property.

## 1 - Webpack

- Install the webpack packages

```shell
npm i -D webpack webpack-cli
```

- Install a package that you want to use in your project.

```shell
npm i date-fns
```

- Reorder the properties in `package.json` in order to put `dependencies` above `devDependencies`.

- Copy the contents of the `extra/01-install-webpack` directory to the root directory of this workshop.
- Add the `build` npm script to `package.json`

```
"build": "webpack"
```

- Run the `build` npm script and examine the output in the `dist` directory.

```shell
npm run build
```

- You need to manually copy the `index.html` file to the `dist` directory.

## 2 - Basic webpack configuration

- Install the css loaders

```shell
npm i -D style-loader css-loader
```

- Delete the `index.js` file in the `src` directory.

- Copy the contents of the `extra/02-webpack-config` directory to the root directory of this workshop.

- Run the `build` npm script and examine the output in the `dist` directory.

```
npm run build
```

## 3 - html-webpack-plugin

- Install the package

```shell
npm i -D html-webpack-plugin
```

- Add the plugin to the webpack plugins section in `webpack.config.js`

```
const HtmlWebpackPlugin = require('html-webpack-plugin');
```

```
new HtmlWebpackPlugin({
  filename: 'index.html',
  inject: 'body',
  template: 'src/index.html',
}),
```

- Remove the `script` tag from the `index.html` file
- Move the `index.html` file to the `src` directory
- Add hashing to the output file names in `webpack.config.js`

```
filename: '[name].[contenthash].js',
```

- Run the `build` npm script and examine the output in the `dist` directory.

```
npm run build
```

- Some files may be left over from previous builds - `main.js`.

## 4 - dev and production builds ft. Webpack Dev Server

- Install Webpack's DevServer package

```shell
npm i -D webpack-dev-server
```

- Add the DevServer config to `webpack.config.js`

```
devServer: {
  port: 3000,
  open: true,
  hot: true,
},
```

- Add the `start` npm script to `package.json`.

```
"start": "webpack serve",
```

- Install cross-env

```shell
npm i -D cross-env
```

- Change the npm scripts in `package.json` to include the environment variable

```
"start": "cross-env NODE_ENV=development webpack serve",
"build": "cross-env NODE_ENV=production webpack"
```

- Change `webpack.config.js` to set webpack's `mode` property.

```
mode: process.env.NODE_ENV,
```

- Install mini-css-extract-plugin

```shell
npm i -D mini-css-extract-plugin
```

- Open `webpack.config.js` and add the loader to the production configuration

```
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
```

```
const styleLoader = {
  loader:
    process.env.NODE_ENV === 'development'
      ? 'style-loader'
      : MiniCssExtractPlugin.loader,
};

```

replace the `style-loader` with the `styleLoader` variable.

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
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
```

```
new CleanWebpackPlugin(),
```

- Install copy-webpack-plugin

```shell
npm i -D copy-webpack-plugin
```

- Add the plugin to the configuration

```
const CopyWebpackPlugin = require('copy-webpack-plugin');
```

```
new CopyWebpackPlugin({
  patterns: [{ from: 'public' }],
}),
```

- Copy the contents of the `extra/04-dev-and-production-builds` directory to the root directory of this workshop.

- Add the icon link to the `head` tag in `index.html`

```html
<link rel="icon" href="/favicon.ico" />
```

- Run the `build` npm script and examine the output in the `dist` directory.

```shell
npm run build
```

- Run the `start` npm script to start the application in development mode.

```shell
npm run start
```

- Don't forget to stop the npm script before you proceed with the workshop.

## 5 - webpack-bundle-analyzer

- Install the package

```shell
npm i -D webpack-bundle-analyzer
```

- Add the `profile` npm script to `package.json`

```
"profile": "cross-env NODE_ENV=production webpack --profile --json=./dist/profile.json && webpack-bundle-analyzer ./dist/profile.json"
```

- Run the `profile` npm script and examine the visualization.

```shell
npm run profile
```

- Don't forget to stop the npm script before you proceed with the workshop.

## 6 - Babel

- Install the packages

```shell
npm i -D babel-loader @babel/core @babel/preset-env core-js
```

- Copy the contents of the `extra/06-babel` directory to the root directory of this workshop.

- Add the loader to `webpack.config.js`

```
{
  test: /\.js$/,
  use: [{ loader: 'babel-loader' }],
  exclude: /node_modules/,
},
```

- Run the `build` npm script and examine the output in the `dist` directory.

```shell
npm run build
```

## 7 - transforming imports

- Install the package

```shell
npm i -D babel-plugin-module-resolver
```

- Add the plugin to the babel config

```
[
  'module-resolver',
  {
    root: ['./src'],
    alias: {
      '^~(.*)': './src/\\1',
      '^src/(.*)': './src/\\1',
    },
  },
],
```

- In `src/main.js`, change the imports of `helpers.js` and `logo.png` to:

```
import { formatDate } from 'src/helpers';
import logoUrl from '~logo.png';
```

- Run the `build` npm script to verify that everything works.

```shell
npm run build
```

## 8 - TypeScript

- Install the packages

```shell
npm i -D typescript@5.4.* @babel/preset-typescript fork-ts-checker-webpack-plugin @total-typescript/ts-reset
```

- Copy the contents of the `extra/08-typescript` directory to the root directory of this workshop.

- Rename `src/main.js` to `src/main.ts`.
- Rename `src/helpers.js` to `src/helpers.ts`
- In `src/helpers.ts`, add a type to the first parameter of the `formatDate` function

- Change the name of the entry in `webpack.config.js`

```
entry: './src/main.ts',
```

- Change the default resolve configuration in `webpack.config.js`

```
resolve: {
  extensions: ['.js', '.ts' ],
},
```

- Change the babel loader configuration in `webpack.config.js` to match typescript files as well

```
test: /\.[jt]s$/,
```

- Add the typescript babel preset in `babel.config.js`

```
'@babel/preset-typescript',
```

- Add the typescript webpack plugin in `webpack.config.js`

```
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
```

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

- Run the `build` script to verify that everything works.

```shell
npm run build
```

## 9 - React

- Install the packages

```shell
npm i react react-dom
npm i -D @types/react @types/react-dom @babel/preset-react
npm i -D @pmmmwh/react-refresh-webpack-plugin react-refresh
```

- Add the babel preset in `babel.config.js`

```
['@babel/preset-react', { runtime: 'automatic' }],
```

- Add the `react-refresh` babel plugin in `babel.config.js`

```
...(process.env.NODE_ENV === 'development' ? ['react-refresh/babel'] : []),
```

- Add the `@pmmmwh/react-refresh-webpack-plugin` plugin in `webpack.config.js`

```
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
```

```
...(process.env.NODE_ENV === 'development'
  ? [new ReactRefreshWebpackPlugin()]
  : []),
```

- Add the `jsx` typescript setting in `tsconfig.json`

```
"jsx": "react-jsx",
```

- Delete `main.ts` from the `src` directory

- Copy the contents of the `extra/09-react` directory to the root directory of this workshop.

- Change the configuration in `webpack.config.js`

  - change the entry setting
    ```
      entry: './src/main.tsx',
    ```
  - change the babel loader matcher
    ```
      test: /\.[jt]sx?$/,
    ```
  - change the resolve.extensions setting
    ```
      resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx'],
      },
    ```

- Add the `#root` div element to the `body` tag in `src/index.html`

```html
<div id="root"></div>
```

- Run the `build` npm script and examine the output in the `dist` directory.

```shell
npm run build
```

- Run the `profile` npm script and examine the visualization.

```shell
npm run profile
```

- Don't forget to stop the npm script before you proceed with the workshop.

## 10 - Jest & Testing Library

- Install the packages

```shell
npm i -D @testing-library/dom @testing-library/react
npm i -D @testing-library/user-event @testing-library/jest-dom
npm i -D jest @types/jest jest-environment-jsdom
npm i -D msw undici
```

- Copy the contents of the `extra/10-rtl` directory to the root directory of this workshop.

- Replace the `test` npm script in `package.json`

```
"test": "cross-env NODE_ENV=test jest",
```

- Add the code coverage output directory to `.gitignore`

```
/coverage/
```

- Add `__mocks__` and `setupTests.ts` to the `include` field in `tsconfig.json`

```
"include": ["src", "__mocks__", "setupTests.ts"]
```

- Run the `test` npm script to verify that the tests pass.

```shell
npm run test
```

## 11 - Prettier

- Install the package

```shell
npm i -D prettier
```

- Copy the contents of the `extra/11-prettier` directory to the root directory of this workshop.

- Add the `format` and `format-check` npm scripts to `package.json`

```
"format": "prettier --cache --write .",
"format-check": "prettier --cache --check .",
```

- Run the `format` npm script

```shell
npm run format
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
npm i -D eslint@8
npm i -D @eslint/eslintrc
npm i -D @eslint/js
npm i -D eslint-config-prettier
npm i -D eslint-import-resolver-alias
npm i -D eslint-import-resolver-typescript
npm i -D eslint-plugin-deprecation
npm i -D eslint-plugin-es
npm i -D eslint-plugin-import
npm i -D eslint-plugin-jsx-a11y
npm i -D eslint-plugin-new-with-error
npm i -D eslint-plugin-react
npm i -D eslint-plugin-react-hooks
npm i -D eslint-plugin-react-refresh
npm i -D eslint-plugin-testing-library
npm i -D eslint-plugin-unused-imports@3
npm i -D eslint-plugin-jest
npm i -D @arabasta/eslint-plugin-no-destructuring-arrays-as-objects
npm i -D @arabasta/eslint-plugin-report-caught-error
npm i -D @arabasta/eslint-plugin-require-useeffect-dependency-array
npm i -D @eslint-community/eslint-plugin-eslint-comments
npm i -D confusing-browser-globals
npm i -D typescript-eslint
npm i -D rimraf
npm i -D globals
```

- Copy the contents of the `extra/12-eslint` directory to the root directory of this workshop.

- Add the npm scripts to `package.json`

```
"lint": "eslint ./ --max-warnings 0",
"lint:fix": "npm run lint -- --fix",
"generate-eslint-resolved-configs": "rimraf ./eslint-resolved-configs && node generate-eslint-resolved-configs.js && npm run format"
```

- Run the `lint:fix` npm script

```shell
npm run lint:fix
```

- Run the `generate-eslint-resolved-configs` npm script

```shell
npm run generate-eslint-resolved-configs
```

- Install the webpack plugin

```shell
npm i -D eslint-webpack-plugin
```

- Add the plugin to the configuration in `webpack.config.js`

```
const ESLintPlugin = require('eslint-webpack-plugin');
```

```
new ESLintPlugin({
  extensions: ['js', 'jsx', 'ts', 'tsx'],
  failOnWarning: true,
  configType: 'flat',
  eslintPath: 'eslint/use-at-your-own-risk',
}),
```

- Run the `build` npm script to verify that everything works.

```shell
npm run build
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

- Add the scss loader configuration to `webpack.config.js`

```
const sass = require('sass');
```

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
        implementation: sass,
      },
    },
  ],
},
```

- Copy the contents of the `extra/13-scss` directory to the root directory of this workshop.

- Import the `scss` file in `src/main.tsx`.

```js
import './styles.scss';
```

- Run the `build` npm script to verify that everything works.

```shell
npm run build
```

## 14 - Tailwind (OPTIONAL)

- Install the packages

```shell
npm i -D tailwindcss postcss postcss-loader cssnano
```

- Copy the contents of the `extra/14-tailwind` directory to the root directory of this workshop.

- Add the postcss loader after the `css-loader` in `webpack.config.js`.

```
{ loader: 'postcss-loader' },
```

- Add the tailwind directives at the start of `main.css`

```
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- Use some tailwind utility in your source file. Example: `text-center`.

- Run the `build` npm script to verify that everything works.

```shell
npm run build
```
