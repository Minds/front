import { Story, Meta, moduleMetadata } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { ButtonComponent } from './button.component';
import { DropdownMenuComponent } from '../dropdown-menu/dropdown-menu.component';
import { DropdownMenuItemComponent } from '../dropdown-menu-item/dropdown-menu-item.component';

// More on default export: https://storybook.js.org/docs/angular/writing-stories/introduction#default-export
export default {
  title: 'Components / Buttons / Button',
  component: ButtonComponent,
  decorators: [
    moduleMetadata({
      // Imports components used for dropdown button
      declarations: [
        ButtonComponent,
        DropdownMenuComponent,
        DropdownMenuItemComponent,
      ],
    }),
  ],
  parameters: {
    docs: {
      description: {
        component: 'TODO',
      },
    },
  },
  argTypes: {
    saving: {
      defaultValue: false,
      description: 'When in a saving/progress state',
      control: 'boolean',
    },
    solid: {
      defaultValue: false,
      description: 'To be used to give prominance to a button',
      control: 'boolean',
    },
    overlay: {
      defaultValue: false,
      description:
        'Creates a semi-transparent background. Used when button is placed on top of images',
      control: 'boolean',
    },
    size: {
      defaultValue: 'medium',
      options: ['xsmall', 'small', 'medium', 'large'],
      control: 'radio',
    },
    label: {
      defaultValue: 'Button',
      control: 'text',
    },
    // dropdown: {
    //   defaultValue: '#template?',
    //   control: TemplateRef,
    // },
    dropdownAnchorPosition: {
      defaultValue: { top: '110%', left: '0' },
      control: 'object',
    },
    showDropdownMenu: {
      defaultValue: true,
      control: 'boolean',
    },
  },
  args: {
    color: 'blue',
    type: 'submit',
  },
  // Don't include the actions data as a story
  excludeStories: /.*Data$/,
} as Meta;

export const actionsData = {
  onClickButton: action('onAction'),
};

// More on component templates: https://storybook.js.org/docs/angular/writing-stories/introduction#using-args
const Template: Story<ButtonComponent> = (args: ButtonComponent) => ({
  props: {
    ...args,
    onAction: actionsData.onClickButton,
  },
  template: `
    <m-button
      [type]="type"
      [disabled]="disabled"
      [overlay]="overlay"
      [iconOnly]="iconOnly"
      [solid]="solid"
      [saving]="saving"
      [pulsating]="pulsating"
      [borderless]="borderless"
      [color]="color"
      [size]="size"
      (onAction)="onAction($event)"
    >
      {{ label }}
    </m-button>
  `,
});

/**
 * Action
 */

export const Action = Template.bind({});
Action.args = {
  label: 'Button',
  color: 'blue',
};

export const ActionDisabled = Template.bind({});
ActionDisabled.args = {
  ...Action.args,
  disabled: true,
};

export const ActionSolid = Template.bind({});
ActionSolid.args = {
  ...Action.args,
  solid: true,
};

export const ActionSolidDisabled = Template.bind({});
ActionSolidDisabled.args = {
  ...ActionSolid.args,
  disabled: true,
};

/**
 * Basic
 */

export const Basic = Template.bind({});
Basic.args = {
  label: 'Button',
  color: 'grey',
};

export const BasicDisabled = Basic.bind({});
BasicDisabled.args = {
  ...Basic.args,
  disabled: true,
};

/**
 * Borderless
 */
export const Borderless = Template.bind({});
Borderless.args = {
  label: 'Button',
  borderless: true,
};

/**
 * Saving
 * */
export const Saving = Template.bind({});
Saving.args = {
  label: 'Button',
  saving: true,
};

/**
 * Warning
 */

export const Warning = Template.bind({});
Warning.args = {
  label: 'Warning',
  color: 'red',
};

export const WarningDisabled = Warning.bind({});
WarningDisabled.args = {
  ...Warning.args,
  disabled: true,
};

/**
 * IconOnly
 */

export const IconOnly: Story<ButtonComponent> = (args: ButtonComponent) => ({
  props: {
    ...args,
    label: undefined,
    icon: 'add',
  },
  template: `
    <m-button
      iconOnly="true"
      [color]="color"
      [size]="size"
      [solid]="solid"
      [overlay]="overlay"
      [saving]="saving"
    >
      <i class="material-icons">{{icon}}</i>
    </m-button>
  `,
});
IconOnly.parameters = {
  docs: {
    description: {
      story: 'For example, the subscribe button on a publisher card.',
    },
  },
};

export const IconOnlySolid = IconOnly.bind({});
IconOnlySolid.args = {
  ...IconOnly.args,
  solid: true,
};
