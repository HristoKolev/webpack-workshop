module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: '3.37',
      },
    ],
  ],
  plugins: [
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
  ],
};
