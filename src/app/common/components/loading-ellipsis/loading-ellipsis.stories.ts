import { Meta, StoryFn } from '@storybook/angular';
import { LoadingEllipsisComponent } from './loading-ellipsis.component';

export default {
  title: 'Components / Progress Indicators / Loading Ellipsis',
  component: LoadingEllipsisComponent,
  argTypes: {
    inProgress: {
      defaultValue: true,
      control: 'boolean',
    },
    dotDiameter: {
      defaultValue: '8px',
      control: 'text',
    },
  },
  args: {},
} as Meta;

const Template: StoryFn<LoadingEllipsisComponent> = (
  args: LoadingEllipsisComponent
) => ({
  props: args,
});

export const Basic = Template.bind({});
Basic.args = {};
