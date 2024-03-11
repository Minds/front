import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChatRoomListComponent } from '../../room-list/room-list.component';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChatPageLayoutComponent } from '../../layout/layout.component';

/**
 * Rooms page for chat.
 */
@Component({
  selector: 'm-chat__roomsListPage',
  templateUrl: './rooms-list-page.component.html',
  styleUrls: ['./rooms-list-page.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgCommonModule,
    RouterModule,
    ChatRoomListComponent,
    ChatPageLayoutComponent,
  ],
  standalone: true,
})
export class ChatRoomsListPageComponent {}
