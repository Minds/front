require('dotenv').config();
const { I } = inject();

type Environment = 'production' | 'canary' | 'staging';

export = {
  uri: '/devtools',

  selectRadioButton(environment: Environment): void {
    I.click(`.m-form__customInputWrapper__radio input[value=${environment}]`);
  },

  submitChange(): void {
    I.click('m-devtools__environmentselector m-button');
  },

  // hasCanaryOption() {
  //   I.seeElement('.m-form__customInputWrapper__radio input[value=${environment}]');
  // }
};
