module.exports = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    'storybook-addon-themes',
    'storybook-addon-angular-router',
    '@chromatic-com/storybook',
  ],

  framework: '@storybook/angular',

  core: {
    builder: '@storybook/builder-webpack5',
  },

  webpackFinal: async (config) => {
    // Removing the global alias as it conflicts with the `global` npm package.
    // can be removed with resolution of https://github.com/storybookjs/storybook/issues/21242
    // and a subsequent update.
    const { global, ...alias } = config.resolve.alias;
    config.resolve.alias = alias;

    // Other config
    return config;
  },

  docs: {
    autodocs: true,
  },
};
