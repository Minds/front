// import { CommonModule } from '@angular/common';
// import {
//   Story,
//   Meta,
//   componentWrapperDecorator,
//   moduleMetadata,
// } from '@storybook/angular';
// import { PageComponent } from '../../modules/layout/page/page.component';
// import { TopbarWrapperComponent } from '../../modules/layout/topbar-wrapper/topbar.component';
// import { SidebarNavigationComponent } from './sidebar/navigation.component';
// import { V3TopbarComponent } from './v3-topbar/v3-topbar.component';

// TODO
// export default {
//   title: 'Layout / Page',
//   decorators: [
//     moduleMetadata({
//       imports: [CommonModule],
//       // Imports both components to allow component composition with Storybook
//       declarations: [
//         SidebarNavigationComponent,
//         TopbarWrapperComponent,
//         V3TopbarComponent,
//         PageComponent,
//       ],
//     }),
//     componentWrapperDecorator(
//       story => `<div style="min-height:100vh">${story}</div>`
//     ),
//   ],
//   args: {},
// } as Meta;

// const Template: Story<any> = (args: any) => ({
//   props: args,
//   template: `
//   <m-app>
//     <m-topbarWrapper>
//       <m-v3Topbar></m-v3Topbar>
//     </m-topbarWrapper>
//     <m-page>
//       <m-body>
//         <div class="m-pageLayout__container" m-pageLayout__container>
//           <div class="m-pageLayout__container--main">
//             <m-sidebar--navigation m-pageLayout__pane="left" class="m-pageLayout__pane--left"></m-sidebar--navigation>
//             <div m-pageLayout__pane="main" class="m-pageLayout__pane--main">main</div>
//             <div m-pageLayout__pane="right" class="m-pageLayout__pane--right">
//               <div class="m-pageLayoutPane__inner">
//                 <div class="m-pageLayoutPane__sticky" m-stickySidebar>
//                   right (sticky)
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </m-body>
//     </m-page>
//   </m-app>
//   `,
// });

// export const Basic = Template.bind({});
// Basic.args = {};
