// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Story, Meta, moduleMetadata } from '@storybook/angular';
import { ApiService } from '../../api/api.service';
import { PublisherCardComponent } from './publisher-card.component';
import { ConfigsService } from '../../services/configs.service';
import { MindsUser } from '../../../interfaces/entities';
import { Session } from '../../../services/session';
import { ActivityV2ExperimentService } from '../../../modules/experiments/sub-services/activity-v2-experiment.service';
import { CommonModule } from '../../common.module';
import { Client } from '../../api/client.service';
import { ThemeService } from '../../services/theme.service';

export default {
  title: 'Composite Components / Publisher Card',
  component: PublisherCardComponent,
  argTypes: {
    publisher: {
      defaultValue: <MindsUser>{
        guid: '123',
        type: 'user',
        name: 'Storybook User',
        username: 'storybook',
        briefdescription: 'I am a description',
        time_created: Date.now(),
        icontime: 1635862076,
        mode: null,
        nsfw: [],
        subscribers_count: 128,
        subscriptions_count: 1,
        plus: true,
      },
      control: { type: 'object' },
    },
    showDescription: {
      defaultValue: true,
      control: 'boolean',
    },
    showSubs: {
      defaultValue: true,
      control: 'boolean',
    },
    showSubscribeButton: {
      defaultValue: true,
      control: 'boolean',
    },
    disableSubscribe: {
      defaultValue: false,
      control: 'boolean',
    },
    featured: {
      defaultValue: false,
      control: 'boolean',
    },
  },
  args: {},
  decorators: [
    /**
     * This is VERY messy. How can we avoid declaring so many services and imports
     */
    moduleMetadata({
      imports: [CommonModule, RouterTestingModule, HttpClientTestingModule],
      providers: [
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
          provide: ConfigsService,
          useValue: {
            get: () => {
              return 'https://cdn.minds.com/';
            },
          },
        },
        ThemeService,
        {
          provide: Client,
          useValue: {
            get: () => {
              return null;
            },
          },
        },
        {
          provide: ApiService,
          useValue: null,
        },
        {
          provide: ActivityV2ExperimentService,
          useValue: {
            isActive: () => {
              return false;
            },
          },
        },
      ],
    }),
  ],
} as Meta;

const Template: Story<PublisherCardComponent> = (
  args: PublisherCardComponent
) => ({
  props: args,
});

export const Basic = Template.bind({});
Basic.args = {};

export const Featured = Template.bind({});
Featured.args = {
  featured: true,
};
