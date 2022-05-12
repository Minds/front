import {
  Story,
  Meta,
  moduleMetadata,
  componentWrapperDecorator,
} from '@storybook/angular';
import { DropdownMenuItemComponent } from '../dropdown-menu-item/dropdown-menu-item.component';
import { DropdownMenuComponent } from './dropdown-menu.component';

export default {
  title: 'Components / Dropdown Menu',
  component: DropdownMenuComponent,
  decorators: [
    moduleMetadata({
      // Imports both components to allow component composition with Storybook
      declarations: [DropdownMenuComponent, DropdownMenuItemComponent],
    }),
    componentWrapperDecorator(
      story => `<div style="min-height:200px">${story}</div>`
    ),
  ],
  args: {
    anchorPosition: { top: '100%', left: '0' },
  },
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
      <m-dropdownMenu__item label="Basic item 1"></m-dropdownMenu__item>
      <m-dropdownMenu__item label="Basic item 2"></m-dropdownMenu__item>
      <m-dropdownMenu__item label="Scary item" red="true"></m-dropdownMenu__item>
    </ul>
  </ng-template>
  `,
});

export const Basic = Template.bind({});
Basic.args = {};
