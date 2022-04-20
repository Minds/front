import { Story, Meta } from '@storybook/angular';
import { DropdownMenuComponent } from './dropdown-menu.component';

export default {
  title: 'Components / Dropdown Menu',
  component: DropdownMenuComponent,
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

const Template: Story<DropdownMenuComponent> = (
  args: DropdownMenuComponent
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
