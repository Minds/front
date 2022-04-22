import { Story, Meta } from '@storybook/angular';
import { DropdownMenuV2Component } from './dropdown-menu-v2.component';

export default {
  title: 'Components / Dropdown Menu',
  component: DropdownMenuV2Component,
  // argTypes: {
  //   size: {
  //     options: ['xsmall', 'small', 'medium', 'large'],
  //     control: { type: 'radio' },
  //   }
  // },
  args: {
    anchorPosition: { top: '100%', left: '0' },
  },
  decorators: [],
} as Meta;

const Template: Story<DropdownMenuV2Component> = (
  args: DropdownMenuV2Component
) => ({
  props: args,
  template: `
  <m-dropdownMenu
    [menu]="actionsDropdown"
    [anchorPosition]="anchorPosition"
  >
    Click to open
  </m-dropdownMenu>

  <ng-template #actionsDropdown>
    <ul>
        <li>
          <span class="m-dropdownMenu__item">First Item</span>
        </li>
        <li>
        <span class="m-dropdownMenu__item">Second Item</span>
      </li>
    </ul>
  </ng-template>
  `,
});

export const Basic = Template.bind({});
Basic.args = {};
