module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: '3.27',
      },
    ],
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript',
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
    ...(process.env.NODE_ENV === 'development' ? ['react-refresh/babel'] : []),
  ],
};
