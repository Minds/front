import { Story, Meta } from '@storybook/angular';
import { ButtonComponent } from './button.component';

// More on default export: https://storybook.js.org/docs/angular/writing-stories/introduction#default-export
export default {
  title: 'Components / Button',
  component: ButtonComponent,
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
      description: 'TDB',
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
    // Outputs
    onAction: {
      action: 'clicked',
    },
  },
  args: {
    color: 'blue',
    type: 'submit',
  },
} as Meta;

// More on component templates: https://storybook.js.org/docs/angular/writing-stories/introduction#using-args
const Template: Story<ButtonComponent> = (args: ButtonComponent) => ({
  props: args,
  template: `
    <m-button
      [type]="type"
      [disabled]="disabled"
      [overlay]="overlay"
      [iconOnly]="iconOnly"
      [solid]="solid"
      [saving]="saving"
      [pulsating]="pulsating"
      [flat]="flat"
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
 * Warning
 */

export const Warning: Story<ButtonComponent> = (args: ButtonComponent) => ({
  props: {
    ...args,
    label: 'Warning',
  },
  template: `
    <m-button
      color="red"
      [size]="size"
      [solid]="solid"
      [overlay]="overlay"
      [saving]="saving"
    >
      {{ label }}
    </m-button>
  `,
});

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
