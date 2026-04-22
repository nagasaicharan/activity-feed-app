// Your custom options.
const workletsPluginOptions = { };


module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@app/ui': './ui',
        },
      },
    ],
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    '@babel/plugin-proposal-export-namespace-from',
    ['react-native-worklets/plugin', workletsPluginOptions],
  ],
};
