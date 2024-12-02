import { RouterTestingModule } from '@angular/router/testing';
import { Meta, StoryFn, moduleMetadata } from '@storybook/angular';
import { sampleUsers } from '../../../../tests/samples/sample-users';
import { Session } from '../../../services/session';
import { CommonModule } from '../../common.module';
import { ConfigsService } from '../../services/configs.service';
import { UserAggregatorComponent } from './user-aggregator.component';
import { NgxFloatUiModule } from 'ngx-float-ui';

export default {
  title: 'Composite Components / User Aggregator',
  component: UserAggregatorComponent,
  argTypes: {
    users: {
      control: 'object',
      description: 'List of users to use.',
      defaultValue: sampleUsers,
    },
    totalCount: {
      defaultValue: 10,
      control: 'number',
      description: `Override the total count so that you can only pass
        a few hydrated users through to display (for optimization) and
        have an accurate "and X others" summary.
      `,
    },
    usernameAmount: {
      defaultValue: 2,
      control: 'number',
      description: 'Amount of usernames to show.',
    },
    avatarAmount: {
      defaultValue: 3,
      control: 'number',
      description: 'Amount of avatars to show.',
    },
  },
  args: {},
  decorators: [
    moduleMetadata({
      imports: [RouterTestingModule, NgxFloatUiModule],
      providers: [
        {
          provide: ConfigsService,
          useValue: {
            get: () => {
              return 'https://cdn.minds.com/';
            },
          },
        },
        {
          provide: Session,
          useValue: {
            getLoggedInUser: () => {
              return {
                guid: '456',
              };
            },
          },
        },
      ],
    }),
  ],
} as Meta;

const Template: StoryFn<any> = (args: UserAggregatorComponent) => ({
  props: args,
});

export const Basic = Template.bind({});
Basic.args = {};
