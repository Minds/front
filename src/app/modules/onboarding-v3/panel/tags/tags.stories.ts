import {
  StoryFn,
  Meta,
  moduleMetadata,
  componentWrapperDecorator,
} from '@storybook/angular';
import { BehaviorSubject } from 'rxjs';
import discoveryTagsMock from '../../../../mocks/responses/discovery-tags.mock';

import { OnboardingV3TagsComponent } from './tags.component';
import { OnboardingV3TagsService } from './tags.service';

export default {
  title: 'Components / Tags / Onboarding Tags',
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
          useValue: {
            tags$: new BehaviorSubject(discoveryTagsMock.default.slice(0, 15)),
            loadTags: () => {
              return null;
            },
            toggleTag: () => {
              return null;
            },
          },
        },
      ],
    }),
    componentWrapperDecorator(
      (story) =>
        `<div>${story}</div><hr><div>Note: the actual component starts with none selected, and the tags can be toggled.`
    ),
  ],
} as Meta;

const Template: StoryFn<OnboardingV3TagsComponent> = (
  args: OnboardingV3TagsComponent
) => ({
  props: args,
});

export const Basic = Template.bind({});
Basic.args = {};
