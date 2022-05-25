import {
  Story,
  Meta,
  moduleMetadata,
  componentWrapperDecorator,
} from '@storybook/angular';
import { DropdownMenuComponent } from './dropdown-menu.component';

import { DropdownMenuItemComponent } from '../dropdown-menu-item/dropdown-menu-item.component';

// We can't reuse these stories because the item component
// is accessed through a TemplateRef
// import * as DropdownMenuItemStories from '../dropdown-menu-item/dropdown-menu-item.stories';

export default {
  title: 'Components / Menus / Dropdown Menu',
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
    anchorPosition: { top: '110%', left: '0' },
    isOpen: true,
  },
} as Meta;

const Template: Story<DropdownMenuComponent> = (
  args: DropdownMenuComponent
) => ({
  props: args,
  template: `
  <m-dropdownMenu
    [menu]="actionsMenu"
    [anchorPosition]="anchorPosition"
  >
    Click to open
  </m-dropdownMenu>

  <ng-template #actionsMenu>
    <ul>
      <m-dropdownMenu__item><span>Basic item 1</span></m-dropdownMenu__item>
      <m-dropdownMenu__item><span>Basic item 2</span></m-dropdownMenu__item>
      <m-dropdownMenu__item red="true"><span>Red item</span></m-dropdownMenu__item>
      <m-dropdownMenu__item disabled="true"><span>Disabled item</span></m-dropdownMenu__item>
    </ul>
  </ng-template>
  `,
});

export const Basic = Template.bind({});
Basic.args = {};

export const SelectableItems: Story<DropdownMenuComponent> = (
  args: DropdownMenuComponent
) => ({
  props: args,
  template: `
  <m-dropdownMenu
    [menu]="actionsMenu"
    [anchorPosition]="anchorPosition"
  >
    Click to open
  </m-dropdownMenu>

    <ng-template #actionsMenu>
    <ul>
      <m-dropdownMenu__item selectable="true" [selected]="true"><span i18n >Selectable item 1</span></m-dropdownMenu__item>
      <m-dropdownMenu__item selectable="true" [selected]="false"><span>Selectable item 2</span></m-dropdownMenu__item>
      <m-dropdownMenu__item selectable="true" [selected]="false"><span>Selectable item 3</span></m-dropdownMenu__item>
    </ul>
  </ng-template>
  `,
});

export const IconItems: Story<DropdownMenuComponent> = (
  args: DropdownMenuComponent
) => ({
  props: args,
  template: `
  <m-dropdownMenu
    [menu]="actionsMenu"
    [anchorPosition]="anchorPosition"
  >
    Click to open
  </m-dropdownMenu>

    <ng-template #actionsMenu>
    <ul>
      <m-dropdownMenu__item icon="visibility"><span i18n >Icon item 1</span></m-dropdownMenu__item>
      <m-dropdownMenu__item icon="favorite"><span>Icon item 2</span></m-dropdownMenu__item>
      <m-dropdownMenu__item icon="pets"><span>Icon item 3</span></m-dropdownMenu__item>
    </ul>
  </ng-template>
  `,
});
