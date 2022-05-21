// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Story, Meta, moduleMetadata } from '@storybook/angular';
import { ApiService } from '../../api/api.service';
import { ButtonComponent } from '../button/button.component';
import { PublisherCardComponent } from './publisher-card.component';
import { SubscribeButtonComponent } from '../subscribe-button/subscribe-button.component';
import { AbbrPipe } from '../../pipes/abbr';
import { TagsPipe } from '../../pipes/tags';
import { ConfigsService } from '../../services/configs.service';
import { FormToastService } from '../../services/form-toast.service';
import { RegexService } from '../../services/regex.service';
import { SiteService } from '../../services/site.service';
import { MindsUser } from '../../../interfaces/entities';
import { AuthModalModule } from '../../../modules/auth/modal/auth-modal.module';
import { AuthModalService } from '../../../modules/auth/modal/auth-modal.service';
import { Client } from '../../../services/api';
import { FeaturesService } from '../../../services/features.service';
import { Session } from '../../../services/session';
import { AnalyticsService } from '../../../services/analytics';
import { CookieOptionsProvider, CookieService } from '@mindsorg/ngx-universal';

export default {
  title: 'Components / Publisher Card',
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
        icontime: Date.now(),
        mode: null,
        nsfw: [],
        subscribers_count: 128,
        subscriptions_count: 1,
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
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [
        PublisherCardComponent,
        SubscribeButtonComponent,
        ButtonComponent,
        AbbrPipe,
        TagsPipe,
      ],
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
              return {};
            },
          },
        },
        {
          provide: Client,
          useValue: {
            get: () => {
              return null;
            },
          },
        },
        FeaturesService,
        AuthModalService,
        FormToastService,
        SiteService,
        RegexService,
        {
          provide: ApiService,
          useValue: null,
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
