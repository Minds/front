import { Meta, StoryFn } from '@storybook/angular';
import { LoadingSpinnerComponent } from './loading-spinner.component';

export default {
  title: 'Components / Progress Indicators / Loading Spinner',
  component: LoadingSpinnerComponent,
  argTypes: {
    inProgress: {
      defaultValue: true,
      control: 'boolean',
    },
  },
  args: {},
} as Meta;

const Template: StoryFn<LoadingSpinnerComponent> = (
  args: LoadingSpinnerComponent
) => ({
  props: args,
});

export const Basic = Template.bind({});
Basic.args = {};
