import { CommonModule } from '@angular/common';
import {
  Story,
  Meta,
  moduleMetadata,
  componentWrapperDecorator,
} from '@storybook/angular';
import discoveryTagsMock from '../../../../mocks/responses/discovery-tags.mock';

import { ButtonComponent } from '../../../../common/components/button/button.component';

//👇 Imports a specific story from Button stories
import { IconOnly } from '../../../../common/components/button/button.stories';

import { OnboardingV3TagsComponent } from './tags.component';
import { OnboardingV3TagsService } from './tags.service';

export default {
  title: 'Components / Tags / Discovery Tag Button',
  component: OnboardingV3TagsComponent,
  parameters: {
    docs: {
      description: {
        component:
          'A button that allows users to add or remove a single tag from their channel',
      },
    },
  },
  decorators: [
    moduleMetadata({
      declarations: [OnboardingV3TagsComponent],
      providers: [
        {
          provide: OnboardingV3TagsService,
          useValue: null,
        },
      ],
    }),
    componentWrapperDecorator(
      story => `<div style="max-width: 250px;">${story}</div>`
    ),
  ],
  args: {
    tag: discoveryTagsMock.tags[0],
  },
} as Meta;

const Template: Story<OnboardingV3TagsComponent> = (
  args: OnboardingV3TagsComponent
) => ({
  props: args,
});

export const Basic = Template.bind({});
Basic.args = {};
