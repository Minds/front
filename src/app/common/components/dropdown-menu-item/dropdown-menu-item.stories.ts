import { Story, Meta } from '@storybook/angular';
import { DropdownMenuItemComponent } from './dropdown-menu-item.component';

export default {
  title: 'Components / Dropdown Menu Item',
  component: DropdownMenuItemComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Component used for formatting of dropdown list items. Intended for use with the <m-dropdownMenu>s component',
      },
    },
  },
  argTypes: {
    label: {
      description: 'The text to be displayed',
      type: { name: 'string', required: true },
      control: 'text',
      defaultValue: null,
    },
    i18n: {
      description: 'Translation string for the displayed text',
      type: { name: 'string', required: false },
      control: 'text',
      defaultValue: null,
    },
    icon: {
      description: 'ID of material icon to be displayed left of the label',
      control: 'string',
      defaultValue: null,
    },
    persistant: {
      description:
        'TRUE if the item is part of a menu of filters or some other selectable trait that persists after the item is clicked (e.g. `videos` in the feed filter). This will leave space for a checkmark that will display to the left of the item when `selected` is true. When selected is false, the item will have secondary text color. FALSE if the item is an ephemeral action (e.g. leave group / remind post)',
      control: 'boolean',
      defaultValue: 'false',
    },
    selected: {
      description:
        'TRUE if a `persistant` item is selected, making a checkmark appear on the left of the label.',
      control: 'boolean',
      defaultValue: false,
    },
    red: {
      description:
        'TRUE when the user needs a visual warning before clicking because the item is destructive. It makes the text red.',
      control: 'boolean',
      defaultValue: false,
    },
    disabled: {
      description:
        "TRUE if the item is disabled and cannot be selected, the text will be lighter and the cursor won't be a pointer.",
      control: 'text',
      defaultValue: null,
    },
    submenu: {
      description:
        'If clicking on the item opens another nested menu, include its TemplateRef here. An arrow will be displayed on the right side of the item to indicate a submenu will be presented on click.',
      defaultValue: 'null',
      // control: 'Object', // ojm???
      control: 'TemplateRef<any>',
    },
  },
} as Meta;

const Template: Story<DropdownMenuItemComponent> = (
  args: DropdownMenuItemComponent
) => ({
  props: args,
  template: `
  <m-dropdownMenu__item
    label="myLabel"
    [anchorPosition]="anchorPosition"
  >
  </m-dropdownMenu__item>


  `,
});

// ojm put back into template?
//   <ng-template #submenu>
// <m-dropdownMenu [menu]="">
//   </ng-template>

export const Basic = Template.bind({});
Basic.args = {};
