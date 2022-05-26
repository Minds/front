import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Story, Meta, moduleMetadata } from '@storybook/angular';
import { ToggleComponent } from './toggle.component';

export default {
  title: 'Components / Inputs / Toggle',
  component: ToggleComponent,
  decorators: [
    moduleMetadata({
      imports: [
        ReactiveFormsModule, // <--------- **This is important**
      ],
    }),
  ],
} as Meta<ToggleComponent>;

const FormControlTemplate: Story<ToggleComponent> = (args: ToggleComponent) => {
  const formGroup = new FormGroup({
    opts: new FormControl('This'),
  });

  return {
    component: ToggleComponent,
    template: `
      <form [formGroup]="form">
        <span>This</span>
        <span>
          <m-toggle
            [mModel]="opts"
            (mModelChange)="setOpt($event)"
            leftValue="this"
            rightValue="that"
          ></m-toggle>
        </span>
        <span>That</span>
      </form>

      <div style="margin-top: 20px">
        <p style="white-space: pre">Value: {{form.value}}</p>
      </div>
    `,
    props: {
      ...args,
      form: formGroup,
    },
  };
};

export const Form = FormControlTemplate.bind({});
Form.args = {};
