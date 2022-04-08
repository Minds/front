import { Story, Meta, moduleMetadata } from '@storybook/angular';
import { AnnouncementComponent } from './announcement.component';
import { CookieService } from '../../../common/services/cookie.service';

export default {
  title: 'Components / Announcement',
  component: AnnouncementComponent,
  argTypes: {
    message: {
      defaultValue: 'This is an announcement',
      control: 'text',
    },
    canClose: {
      defaultValue: true,
      control: 'boolean',
    },
  },
  args: {},
  decorators: [
    moduleMetadata({
      providers: [
        {
          provide: CookieService,
          useValue: {
            get: () => {},
            put: () => {},
          },
        },
      ],
    }),
  ],
} as Meta;

const Template: Story<AnnouncementComponent> = (
  args: AnnouncementComponent
) => ({
  props: args,
  template: `
    <m-announcement [canClose]="canClose">{{ message }}</m-announcement>
  `,
});

export const Basic = Template.bind({});
Basic.args = {};
