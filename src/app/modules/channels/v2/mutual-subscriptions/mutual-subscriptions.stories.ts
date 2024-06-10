import { RouterTestingModule } from '@angular/router/testing';
import { StoryFn, moduleMetadata } from '@storybook/angular';
import { Session } from '../../../../services/session';
import { CommonModule } from '../../../../common/common.module';
import { ConfigsService } from '../../../../common/services/configs.service';
import { MutualSubscriptionsComponent } from './mutual-subscriptions.component';
import { ApiService } from '../../../../common/api/api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { sampleUsers } from '../../../../../tests/samples/sample-users';

export default {
  title: 'Channel Components / Mutual Subscriptions',
  component: MutualSubscriptionsComponent,
  argTypes: {
    userGuid: {
      control: 'string',
      description: 'The user guid to compare to',
      defaultValue: '123',
    },
  },
  args: {},
  decorators: [
    moduleMetadata({
      imports: [CommonModule, RouterTestingModule, BrowserAnimationsModule],
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
        {
          provide: ApiService,
          useValue: {
            get: () => {
              return new BehaviorSubject({
                count: 12,
                users: sampleUsers,
              });
            },
          },
        },
      ],
    }),
  ],
};

const Template: StoryFn<MutualSubscriptionsComponent> = (
  args: MutualSubscriptionsComponent
) => ({
  props: args,
});

export const Basic = Template.bind({});
Basic.args = {};

//

const SingleUserTemplate: StoryFn<MutualSubscriptionsComponent> = (
  args: MutualSubscriptionsComponent
) => ({
  props: args,
  moduleMetadata: {
    providers: [
      {
        provide: ApiService,
        useValue: {
          get: () => {
            return new BehaviorSubject({
              count: 1,
              users: sampleUsers.slice(0, 1),
            });
          },
        },
      },
    ],
  },
});

export const SingleUser = SingleUserTemplate.bind({});
SingleUser.args = {};

//

const TwoUsersTemplate: StoryFn<MutualSubscriptionsComponent> = (
  args: MutualSubscriptionsComponent
) => ({
  props: args,
  moduleMetadata: {
    providers: [
      {
        provide: ApiService,
        useValue: {
          get: () => {
            return new BehaviorSubject({
              count: 2,
              users: sampleUsers.slice(0, 2),
            });
          },
        },
      },
    ],
  },
});

export const TwoUsers = TwoUsersTemplate.bind({});
TwoUsers.args = {};

//

const ThreeUsersTemplate: StoryFn<MutualSubscriptionsComponent> = (
  args: MutualSubscriptionsComponent
) => ({
  props: args,
  moduleMetadata: {
    providers: [
      {
        provide: ApiService,
        useValue: {
          get: () => {
            return new BehaviorSubject({
              count: 3,
              users: sampleUsers.slice(0, 3),
            });
          },
        },
      },
    ],
  },
});

export const ThreeUsers = ThreeUsersTemplate.bind({});
ThreeUsers.args = {};
