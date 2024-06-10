import { StoryFn } from '@storybook/angular';

export default {
  title: 'Components / Inputs / Radio',
  argTypes: {
    opts: {
      defaultValue: ['Cats', 'Dogs', 'Horses', 'Iguanas'],
      control: 'array',
    },
  },
  args: {},
  decorators: [],
};

const Template: StoryFn<any> = (args: any) => ({
  props: args,
  template: `
    <div class="m-formWrapper">
      <div class="m-form__field--radio">
        <div class="m-form__row--label">
          <label>
            Choose one
           </label>
        </div>
        <div class="m-form__row--input">
          <ng-container *ngFor="let opt of opts">
            <label
              [for]="opt"
              class="m-form__customInputWrapper__radio"
              >{{ opt }}
              <input
                type="radio"
                [id]="opt"
                name="opt"
                [value]="opt"
                formControlName="opts"
                class="form-control"
              />
              <span class="m-form__customInput__radio"></span>
            </label>
          </ng-container>
        </div>
      </div>
    </div>
  `,
});

export const Basic = Template.bind({});
Basic.args = {};
