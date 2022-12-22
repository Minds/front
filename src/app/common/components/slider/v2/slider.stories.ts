import { Story, Meta, moduleMetadata } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { FormInputSliderV2Component } from './slider.component';
import { FormsModule } from '@angular/forms';

// More on default export: https://storybook.js.org/docs/angular/writing-stories/introduction#default-export
export default {
  title: 'Components / Inputs / Slider',
  component: FormInputSliderV2Component,
  decorators: [
    moduleMetadata({
      // Imports components used for dropdown button
      imports: [FormsModule],
      declarations: [FormInputSliderV2Component],
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
    max: {
      description: 'The max value of the input',
      control: 'number',
    },
    min: {
      description: 'The min value of the input',
      control: 'number',
    },
    min: {
      description: 'The default value',
      control: 'number',
    },
  },
  args: {
    max: null,
    min: null,
    value: 10,
    steps: null,
  },
  // Don't include the actions data as a story
  excludeStories: /.*Data$/,
} as Meta;

export const actionsData = {
  onClickButton: action('onAction'),
};

// More on component templates: https://storybook.js.org/docs/angular/writing-stories/introduction#using-args
const Template: Story<FormInputSliderV2Component> = (
  args: FormInputSliderV2Component
) => ({
  props: {
    ...args,
  },
  template: `
    <m-formInput__sliderV2
        [(ngModel)]="value"
        [steps]="steps"
    >
    </m-formInput__sliderV2>
  `,
});

export const Default = Template.bind({});
Default.args = {};

export const CustomSteps = Template.bind({});
CustomSteps.args = {
  ...Default.args,
  steps: [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    20,
    50,
    100,
    300,
  ],
};
