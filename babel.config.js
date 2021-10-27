module.exports = function (api) {
  api.cache(true);

  const presets = [
    '@babel/preset-typescript',
    [
      '@babel/preset-env',
      {
        'targets': {
          'browsers': 'defaults',
        },
      },
    ],
  ];

  const plugins = [
    ['@babel/plugin-proposal-optional-chaining'],
    ['@babel/plugin-proposal-decorators', { 'legacy': true }],
    ['@babel/proposal-class-properties', { 'loose': true }],
    ['@babel/proposal-object-rest-spread'],
  ];

  return {
    presets,
    plugins,
  };
};
