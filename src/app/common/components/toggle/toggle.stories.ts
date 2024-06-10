import { action } from '@storybook/addon-actions';
import { StoryFn, Meta } from '@storybook/angular';
import { ToggleComponent } from './toggle.component';

export default {
  title: 'Components / Inputs / Toggle',
  component: ToggleComponent,
  args: {
    leftValue: 'off',
    rightValue: 'on',
    mModel: 'off',
  },
  // Don't include the actions data as a story
  excludeStories: /.*Data$/,
} as Meta<ToggleComponent>;

export const actionsData = {
  onClick: action('toggle'),
};

const Template: StoryFn<any> = (args: ToggleComponent) => ({
  props: {
    ...args,
    toggle: actionsData.onClick,
  },
  template: `
        <span>{{leftValue}}</span>
        <span>
          <m-toggle
            [leftValue]="leftValue"
            [rightValue]="RightValue"
            [mModel]="mModel"
            (mModelChange)="mModel = $event"
          ></m-toggle>
        </span>
        <span>{{rightValue}}</span>
      <hr>
      <div>TODO: enable toggle action</div>
    `,
});

export const Basic = Template.bind({});
Basic.args = {};
