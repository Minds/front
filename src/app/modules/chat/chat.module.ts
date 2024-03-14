import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { RouteReuseStrategy, RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { ChatRoomsListPageComponent } from './components/pages/rooms-list-page/rooms-list-page.component';
import { experimentVariationGuard } from '../experiments/experiment-variation.guard';
import { PathMatch } from '../../common/types/angular.types';
import { ChatRequestsPageComponent } from './components/pages/request-page/requests-page.component';
import { NoChatsSubPageComponent } from './components/pages/sub-pages/no-chats/no-chats.component';
import { ChatRequestsInfoSubPageComponent } from './components/pages/sub-pages/chat-requests-info/chat-requests-info.component';
import { ChatRoomComponent } from './components/pages/sub-pages/chat-room/chat-room.component';
import { NoRouteReuseStrategy } from '../../common/routerReuseStrategies/no-route-reuse.strategy';
import { loggedInRedirectGuard } from '../../common/guards/logged-in-redirect.guard';

const CHAT_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'rooms',
    pathMatch: 'full' as PathMatch,
  },
  {
    path: 'rooms',
    component: ChatRoomsListPageComponent,
    canActivate: [
      experimentVariationGuard('epic-358-chat'),
      loggedInRedirectGuard('/'),
    ],
    children: [
      {
        path: '',
        component: NoChatsSubPageComponent,
        data: { fullWidthOnly: true, reloadOnRouteChange: true },
      },
      {
        path: ':roomId',
        component: ChatRoomComponent,
        data: { reloadOnRouteChange: true },
      },
    ],
  },
  {
    path: 'requests',
    component: ChatRequestsPageComponent,
    canActivate: [
      experimentVariationGuard('epic-358-chat'),
      loggedInRedirectGuard('/'),
    ],
    children: [
      {
        path: '',
        component: ChatRequestsInfoSubPageComponent,
        data: { fullWidthOnly: true },
      },
    ],
  },
];

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(CHAT_ROUTES),
    MarkdownModule.forChild(),
  ],
  declarations: [],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: NoRouteReuseStrategy,
    },
  ],
})
export class ChatModule {}
