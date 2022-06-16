import { CommonModule } from '@angular/common';
import {
  Story,
  Meta,
  moduleMetadata,
  componentWrapperDecorator,
} from '@storybook/angular';
import discoveryTagsMock from '../../../../mocks/responses/discovery-tags.mock';
import { DiscoveryTagsService } from '../tags.service';

import { DiscoveryTagButtonComponent } from './tag-button.component';
import { ButtonComponent } from '../../../../common/components/button/button.component';

//👇 Imports a specific story from Button stories
import { IconOnly } from '../../../../common/components/button/button.stories';

import { Session } from '../../../../services/session';
import { sessionMock } from '../../../../services/session-mock';
import { AuthModalService } from '../../../auth/modal/auth-modal.service';

export default {
  title: 'Components / Tags / Discovery Tag Button',
  component: DiscoveryTagButtonComponent,
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
      // Imports both components to allow component composition with Storybook
      declarations: [DiscoveryTagButtonComponent, ButtonComponent],
      providers: [
        {
          provide: DiscoveryTagsService,
          useValue: null,
        },
        {
          provide: Session,
          useValue: sessionMock,
        },
        {
          provide: AuthModalService,
          useValue: null,
        },
      ],
    }),
    componentWrapperDecorator(
      story => `<div style="max-width: 50px;">${story}</div>`
    ),
  ],
  args: {
    tag: discoveryTagsMock.tags[0],
  },
} as Meta;

const Template: Story<DiscoveryTagButtonComponent> = (
  args: DiscoveryTagButtonComponent
) => ({
  props: args,
});

export const Selected = Template.bind({});
Selected.args = {
  ...IconOnly.args,
};

export const Unselected = Template.bind({});
Unselected.args = {
  ...Selected.args,
  tag: { value: 'anime' },
};
