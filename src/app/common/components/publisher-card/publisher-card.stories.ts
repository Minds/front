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
import userMock from '../../../mocks/responses/user.mock';
import configsMock from '../../../mocks/responses/configs.mock';

export default {
  title: 'Composite Components / Publisher Card',
  component: PublisherCardComponent,
  argTypes: {
    publisher: {
      defaultValue: userMock,
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
              return configsMock.cdn_url;
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
