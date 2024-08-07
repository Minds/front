export default {
  title: 'Components / Tabs / Tabs',
  argTypes: {
    tabs: {
      defaultValue: [
        { label: 'Tab 1', selected: true },
        { label: 'Tab 2', selected: false },
      ],
      control: 'array',
    },
  },
  args: {
    //anchorPosition: { top: '100%', left: '0' }
  },
  decorators: [],
} as any;

const Template: any = (args: any) => ({
  props: args,
  template: `
  <ul class="m-tabs__container">
    <li class="m-tabs__tab" *ngFor="let tab of tabs">
      <a [class.selected]="tab.selected">{{ tab.label }}</a>
    </li>
  </ul>
  `,
});

export const Basic = Template.bind({});
Basic.args = {};
