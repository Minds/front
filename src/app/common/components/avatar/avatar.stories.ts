import {
  Story,
  Meta,
  moduleMetadata,
  componentWrapperDecorator,
} from '@storybook/angular';
import { ConfigsService } from '../../services/configs.service';
import { Session } from '../../../services/session';
import { CommonModule } from '../../common.module';
import userMock from '../../../mocks/responses/user.mock';
import { MindsAvatar } from './avatar';
import configsMock from '../../../mocks/responses/configs.mock';
import { UserAvatarService } from '../../services/user-avatar.service';
import { userAvatarServiceMock } from '../../services/user-avatar.service-mock';

export default {
  title: 'Components / Channel / Avatar',
  component: MindsAvatar,
  argTypes: {
    object: {
      defaultValue: userMock,
      control: { type: 'object' },
    },
    src: {
      defaultValue: userMock.avatar_url.large,
      control: 'text',
    },
    // NOTE: Below inputs are used only in group profile

    // editMode: {
    //   defaultValue: false,
    //   control: 'boolean',
    // },
    // waitForDoneSignal: {
    //   defaultValue: false,
    //   control: 'boolean',
    // },
    // showPrompt: {
    //   defaultValue: false,
    //   control: 'boolean',
    // },
  },
  args: {},
  decorators: [
    moduleMetadata({
      imports: [CommonModule],
      providers: [
        {
          provide: UserAvatarService,
          useValue: userAvatarServiceMock,
        },
        {
          provide: ConfigsService,
          useValue: {
            get: () => {
              return configsMock.cdn_url;
            },
          },
        },
        {
          provide: Session,
          useValue: {
            getLoggedInUser: () => {
              return userMock;
            },
          },
        },
      ],
    }),
  ],
} as Meta;

const Template: Story<MindsAvatar> = (args: MindsAvatar) => ({
  props: args,
});

export const Large = Template.bind({});
Large.args = {
  src: userMock.avatar_url.large,
};
Large.decorators = [
  componentWrapperDecorator(
    story =>
      `<div style="height: 400px; width: 400px" class="m-avatar__wrapper">${story}</div><hr><div>Maintains proportions of original image, with longest side no larger than 425px. By default, the component returns large size if passed an object. Other sizes can be accessed by adding the url via src input.</div>`
  ),
];

export const Medium = Template.bind({});
Medium.args = {
  src: userMock.avatar_url.medium,
};
Medium.decorators = [
  componentWrapperDecorator(
    story =>
      `<div style="height: 100px; width: 100px" class="m-avatar__wrapper">${story}</div><hr><div>Cropped to 100px × 100px</div>`
  ),
];

export const Small = Template.bind({});
Small.args = {
  src: userMock.avatar_url.small,
};
Small.decorators = [
  componentWrapperDecorator(
    story =>
      `<div style="height: 40px; width: 40px" class="m-avatar__wrapper">${story}</div><hr><div>Cropped to 40px × 40px</div>`
  ),
];

export const Tiny = Template.bind({});
Tiny.args = {
  src: userMock.avatar_url.tiny,
};
Tiny.decorators = [
  componentWrapperDecorator(
    story =>
      `<div style="height: 25px; width: 25px" class="m-avatar__wrapper">${story}</div><hr><div>Cropped to 25px × 25px</div>`
  ),
];
