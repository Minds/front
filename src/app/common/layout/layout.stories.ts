import { Story, Meta } from '@storybook/angular';

export default {
  title: 'Layout / Feed',

  args: {
    //anchorPosition: { top: '100%', left: '0' }
  },
  decorators: [],
} as Meta;

const Template: Story<any> = (args: any) => ({
  props: args,
  template: `
  <m-app>
    <m-topbarWrapper>
      <m-v3Topbar></m-v3Topbar>
    </m-topbarWrapper>
    <m-page>
      <m-body>
        <div class="m-pageLayout__container" m-pageLayout__container>
          <div class="m-pageLayout__container--main">
            <m-sidebar--navigation m-pageLayout__pane="left"></m-sidebar--navigation>
            <div class="m-pageLayout__pane--main">main</div>
            <div class="m-pageLayout__pane--right">
              <div class="m-pageLayoutPane__inner">
                <div class="m-pageLayoutPane__sticky" m-stickySidebar>
                  right (sticky)
                </div>
              </div>
            </div>
          </div>
        </div>
      </m-body>
    </m-page>
  </m-app>
  `,
});

export const Basic = Template.bind({});
Basic.args = {};
