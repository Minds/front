import {
  Story,
  Meta,
  moduleMetadata,
  componentWrapperDecorator,
} from '@storybook/angular';
import { DropdownMenuComponent } from '../dropdown-menu/dropdown-menu.component';
import { DropdownMenuItemComponent } from './dropdown-menu-item.component';

export default {
  title: 'Components / Menus / Dropdown Menu Item',
  component: DropdownMenuItemComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Component used for formatting of dropdown list items. Intended for use with the `<m-dropdownMenu>` component. The label should be included in a `<span>` tag and will be displayed using content projection.',
      },
    },
  },
  decorators: [
    moduleMetadata({
      // Imports both components to allow component composition with Storybook
      declarations: [DropdownMenuComponent, DropdownMenuItemComponent],
    }),
    componentWrapperDecorator(
      story => `<div style="max-width:250px">${story}</div>`
    ),
  ],
  argTypes: {
    icon: {
      description: 'ID of material icon to be displayed left of the label',
      type: { name: 'string', required: false },
      control: 'text',
      defaultValue: null,
      table: {
        defaultValue: { summary: null },
      },
    },
    selectable: {
      description:
        'For items that are part of a filter (or other selectable trait that persists whether the dropdown menu is open or closed). *TRUE* if the item is part of a menu of filters or some other selectable trait that persists after the item is clicked (e.g. "videos" in the feed filter). This will leave space for a checkmark that will display to the left of the item when `selected` is true. *FALSE* if the item is an ephemeral action (e.g. "leave group" / "report channel")',

      control: 'boolean',
      defaultValue: false,
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    selected: {
      description:
        '*TRUE* if a `selectable` item is selected, making a checkmark appear on the left of the label.',
      control: 'boolean',
      defaultValue: false,
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    red: {
      description:
        '*TRUE* when the user needs a visual warning before clicking because the item is destructive. It makes the text red.',
      control: 'boolean',
      defaultValue: false,
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      description:
        "*TRUE* if the item is disabled and cannot be selected, the text will be lighter and the cursor won't be a pointer.",
      control: 'boolean',
      defaultValue: false,
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    hasSubmenu: {
      description:
        '*TRUE* if clicking on the item opens another nested menu. An arrow will be displayed on the right side of the item to indicate a submenu will be presented on click.',
      control: 'boolean',
      defaultValue: false,
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    link: {
      description:
        'Router link string, if clicking the button goes to another Minds page',
      control: 'text',
      defaultValue: null,
      table: {
        defaultValue: { summary: null },
      },
    },
    externalLink: {
      description:
        'href, if clicking the button opens a new window on an external site',
      control: 'text',
      defaultValue: null,
      table: {
        defaultValue: { summary: null },
      },
    },
  },
} as Meta;

const Template: Story<DropdownMenuItemComponent> = (
  args: DropdownMenuItemComponent
) => ({
  props: args,
  template: `
  <m-dropdownMenu__item
    [selectable]="selectable"
    [selected]="selected"
    [disabled]="disabled"
    [red]="red"
    [icon]="icon"
    [hasSubmenu]="hasSubmenu"
    [link]="link"
  >
    <span i18n="@@MY_TRANSLATION_ID">Item</span>
  </m-dropdownMenu__item>
  `,
});

export const Basic = Template.bind({});
Basic.args = {
  icon: null,
  selectable: false,
  selected: false,
  red: false,
  disabled: false,
  hasSubmenu: null,
  link: null,
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...Basic.args,
  disabled: true,
};

export const HasIcon = Template.bind({});
HasIcon.args = {
  ...Basic.args,
  icon: 'favorite',
};

export const Red = Template.bind({});
Red.args = {
  ...Basic.args,
  red: true,
};

export const SelectableUnselected = Template.bind({});
SelectableUnselected.args = {
  ...Basic.args,
  selectable: true,
  selected: false,
};

export const SelectableSelected = Template.bind({});
SelectableSelected.args = {
  ...Basic.args,
  selectable: true,
  selected: true,
};

export const HasSubmenu = Template.bind({});
HasSubmenu.args = {
  ...Basic.args,
  hasSubmenu: true,
};

export const Link = Template.bind({});
Link.args = {
  ...Basic.args,
  link: '/newsfeed',
};
