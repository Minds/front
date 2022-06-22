// import { CommonModule } from '@angular/common';
// import { Injector } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { RouterTestingModule } from '@angular/router/testing';
// import {
//   Story,
//   Meta,
//   componentWrapperDecorator,
//   moduleMetadata,
// } from '@storybook/angular';
// import { AuthModalService } from '../../../modules/auth/modal/auth-modal.service';
// import { EarnModalService } from '../../../modules/blockchain/earn/earn-modal.service';
// import { BuyTokensModalService } from '../../../modules/blockchain/token-purchase/v2/buy-tokens-modal.service';
// import { Web3WalletService } from '../../../modules/blockchain/web3-wallet.service';
// import { BoostModalLazyService } from '../../../modules/boost/modal/boost-modal-lazy.service';
// import { ComposerModalService } from '../../../modules/composer/components/modal/modal.service';
// import { ExperimentsService } from '../../../modules/experiments/experiments.service';
// import { Navigation } from '../../../services/navigation';
// import { Session } from '../../../services/session';
// import { Client } from '../../api/client.service';
// import { ConfigsService } from '../../services/configs.service';
// import { ThemeService } from '../../services/theme.service';
// import { UserMenuService } from '../v3-topbar/user-menu/user-menu.service';
// import { SidebarNavigationComponent } from './navigation.component';
// import { SidebarNavigationService } from './navigation.service';

// TODO
// export default {
//   title: 'Layout / Navigation / Sidebar Left',
//   component: SidebarNavigationComponent,
//   decorators: [
//     componentWrapperDecorator(
//       story => `<div style="min-height:100vh">${story}</div>`
//     ),
//     moduleMetadata({
//       imports: [CommonModule],
//       providers: [
//         {
//           provide: Navigation,
//           useValue: null,
//         },
//         {
//           provide: Session,
//           useValue: {
//             getLoggedInUser: () => {
//               return {
//                 guid: '456',
//                 name: 'Storybook User',
//                 username: 'storybook',
//                 icontime: 1635862076,
//               };
//             },
//           },
//         },
//         {
//           provide: SidebarNavigationService,
//           useValue: {
//             setContainer: () => {
//               return null;
//             },
//           },
//         },
//         {
//           provide: ConfigsService,
//           useValue: {
//             get: () => {
//               return 'https://cdn.minds.com/';
//             },
//           },
//         },
//         {
//           provide: Client,
//           useValue: {
//             get: () => {
//               return null;
//             },
//           },
//         },
//         {
//           provide: ActivatedRoute,
//           useValue: null,
//         },
//         {
//           provide: Router,
//           useValue: null,
//         },
//         {
//           provide: UserMenuService,
//           useValue: null,
//         },
//         {
//           provide: BuyTokensModalService,
//           useValue: null,
//         },
//         {
//           provide: Web3WalletService,
//           useValue: null,
//         },
//         {
//           provide: AuthModalService,
//           useValue: null,
//         },
//         {
//           provide: BoostModalLazyService,
//           useValue: null,
//         },
//         {
//           provide: EarnModalService,
//           useValue: null,
//         },
//         {
//           provide: ComposerModalService,
//           useValue: null,
//         },
//         {
//           provide: ThemeService,
//           useValue: null,
//         },
//         {
//           provide: ExperimentsService,
//           useValue: {
//             hasVariation: () => {
//               return false;
//             },
//           },
//         },

//         // Injector,
//       ],
//     }),
//   ],
//   args: {},
// } as Meta;

// const Template: Story<SidebarNavigationComponent> = (
//   args: SidebarNavigationComponent
// ) => ({
//   props: args,
// });

// export const Basic = Template.bind({});
// Basic.args = {};
