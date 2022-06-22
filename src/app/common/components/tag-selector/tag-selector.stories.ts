import { CommonModule } from '@angular/common';
import {
  Story,
  Meta,
  moduleMetadata,
  componentWrapperDecorator,
} from '@storybook/angular';

import discoveryTagsMock from '../../../mocks/responses/discovery-tags.mock';

//👇 Imports a specific story from Button stories
import { ButtonComponent } from '../button/button.component';
import { HasIcon } from '../button/button.stories';
import { TagSelectorComponent } from './tag-selector.component';

export default {
  title: 'Components / Tags / Tag Selector',
  component: TagSelectorComponent,
  parameters: {
    docs: {
      description: {
        component:
          'A button that allows users to add or remove a single tag from their channel. Example: content settings modal',
      },
    },
  },
  decorators: [
    moduleMetadata({
      declarations: [TagSelectorComponent, ButtonComponent],
    }),
    componentWrapperDecorator(
      story => `<div style="max-width: 500px;">${story}</div>`
    ),
  ],
  args: {
    tags: discoveryTagsMock.default,
  },
} as Meta;

const Template: Story<TagSelectorComponent> = (args: TagSelectorComponent) => ({
  props: args,
});

export const Basic = Template.bind({});
Basic.args = {
  ...HasIcon.args,
};
