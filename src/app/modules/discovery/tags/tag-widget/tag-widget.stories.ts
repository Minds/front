// TODO: Figure out how to use query params in storybook

// import { CommonModule } from '@angular/common';
// import {
//   Story,
//   Meta,
//   moduleMetadata,
//   componentWrapperDecorator,
// } from '@storybook/angular';
// import { DiscoveryTagsService } from '../tags.service';

// //👇 Imports a specific story from Button stories
// import { Unselected } from '../tag-button/tag-button.stories';

// import { Session } from '../../../../services/session';
// import { sessionMock } from '../../../../services/session-mock';
// import { DiscoveryTagButtonComponent } from '../tag-button/tag-button.component';
// import { DiscoveryTagWidgetComponent } from './tag-widget.component';
// import { RouterTestingModule } from '@angular/router/testing';
// import { RegexService } from '../../../../common/services/regex.service';
// import { DiscoveryTagsServiceMock } from '../tags.service-mock';

// export const tagData: string = 'anime';

// export default {
//   title: 'Components / Tags / Discovery Tag Widget',
//   component: DiscoveryTagWidgetComponent,
//   parameters: {
//     docs: {
//       description: {
//         component: 'Allows users to quickly add a tag that they searched for',
//       },
//     },
//     angularRouter: { active: `/discovery/search?q=${tagData}` },
//   },
//   decorators: [
//     moduleMetadata({
//       declarations: [DiscoveryTagWidgetComponent, DiscoveryTagButtonComponent],
//       imports: [RouterTestingModule],
//       providers: [
//         {
//           provide: DiscoveryTagsService,
//           useValue: DiscoveryTagsServiceMock,
//         },
//         {
//           provide: Session,
//           useValue: sessionMock,
//         },
//         {
//           provide: RegexService,
//           useValue: {
//             getRegex: () => {
//               return tagData;
//             },
//           },
//         },
//       ],
//     }),
//     componentWrapperDecorator(
//       story => `<div style="max-width: 250px;">${story}</div>`
//     ),
//   ],
//   args: {
//     // tag: tagData,
//   },
//   // Don't include the tagData as a story
//   excludeStories: /.*Data$/,
// } as Meta;

// const Template: Story<DiscoveryTagWidgetComponent> = (
//   args: DiscoveryTagWidgetComponent
// ) => ({
//   props: args,
// });

// export const Basic = Template.bind({});
// Basic.args = {
//   // ...Unselected.args,
// };
