import { RouterTestingModule } from '@angular/router/testing';
import { Story, Meta, moduleMetadata } from '@storybook/angular';
import { sampleUsers } from '../../../../tests/samples/sample-users';
import { AuthModalService } from '../../../modules/auth/modal/auth-modal.service';
import { ExperimentsService } from '../../../modules/experiments/experiments.service';
import { Session } from '../../../services/session';
import { Client } from '../../api/client.service';
import { CommonModule } from '../../common.module';
import { ConfigsService } from '../../services/configs.service';
import { ToasterService } from '../../services/toaster.service';
import { ThumbsUpButton } from './thumbs-up.component';

export default {
  title: 'Components / Buttons / Thumbs Up',
  component: ThumbsUpButton,
  argTypes: {},
  args: {},
  decorators: [
    moduleMetadata({
      imports: [CommonModule, RouterTestingModule],
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
                guid: '123',
              };
            },
          },
        },
        {
          provide: Client,
          useValue: {},
        },
        {
          provide: AuthModalService,
          useValue: {},
        },
        {
          provide: ExperimentsService,
          useValue: {
            hasVariation: () => {
              return true;
            },
          },
        },
        ToasterService,
      ],
    }),
  ],
} as Meta;

const Template: Story<ThumbsUpButton> = (args: ThumbsUpButton) => ({
  props: args,
});

export const Basic = Template.bind({});
Basic.args = {};

export const InProgress = Template.bind({});
InProgress.args = {
  inProgress: true,
  object: {
    'thumbs:up:user_guids': ['123'],
  },
};

export const ActiveState = Template.bind({});
ActiveState.args = {
  inProgress: false,
  object: {
    'thumbs:up:user_guids': ['123'],
  },
};
