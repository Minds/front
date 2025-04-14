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
import { loggedInRedirectGuard } from '../../common/guards/logged-in-redirect.guard';
import { ChatReceiptService } from './services/chat-receipt.service';
import { AiChatComponent } from './components/pages/ai/ai-chat.component';

const CHAT_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'rooms',
    pathMatch: 'full' as PathMatch,
  },
  {
    path: 'rooms',
    component: ChatRoomsListPageComponent,
    canActivate: [loggedInRedirectGuard('/')],
    children: [
      {
        path: '',
        component: NoChatsSubPageComponent,
        data: { fullWidthOnly: true, reloadOnRouteChange: true },
      },
      {
        path: ':roomId',
        component: ChatRoomComponent,
        data: { reloadOnParamChange: true },
      },
    ],
  },
  {
    path: 'ai',
    component: AiChatComponent,
    data: {
      fullWidthOnly: true,
    },
  },
  {
    path: 'requests',
    component: ChatRequestsPageComponent,
    canActivate: [loggedInRedirectGuard('/')],
    children: [
      {
        path: '',
        component: ChatRequestsInfoSubPageComponent,
        data: { fullWidthOnly: true, reloadOnRouteChange: true },
      },
      {
        path: ':roomId',
        component: ChatRoomComponent,
        data: { requestMode: true, reloadOnParamChange: true },
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
  providers: [ChatReceiptService],
})
export class ChatModule {}
