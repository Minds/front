import { setCompodocJson } from '@storybook/addon-docs/angular';
import docJson from '../documentation.json';
setCompodocJson(docJson);
// .storybook/preview.js

import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  viewport: {
    viewports: INITIAL_VIEWPORTS,
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  docs: { inlineStories: true },
  themes: {
    clearable: false,
    list: [
      {
        name: 'light mode',
        class: ['m-theme__2020', 'm-theme__light'],
        color: '#FFF',
        default: true,
      },
      {
        name: 'dark mode',
        class: ['m-theme__2020', 'm-theme__dark'],
        color: '#111',
      },
    ],
  },
};
