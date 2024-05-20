import { StoryFn, Meta } from '@storybook/angular';

export default {
  title: 'Components / Inputs / Checkbox',
  args: {},
  decorators: [],
} as Meta;

const Template: StoryFn<any> = (args: any) => ({
  props: args,
  template: `
  <div class="m-formWrapper">
  <div class="m-form__row--input">
      <label for="story" class="m-form__customInputWrapper__checkbox">
        <ng-container
          >Check me</ng-container
        >
        <input
          type="checkbox"
          id="story"
          name="story"
          formControlName="story"
          class="form-control"
        />
        <span class="m-form__customInput__checkbox"></span>
      </label>
    </div>
    </div>
  `,
});

export const Basic = Template.bind({});
Basic.args = {};
