import { CommonModule as NgCommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { CommonModule } from '../../../../../common/common.module';
import { ChatRoomUtilsService } from '../../../services/utils.service';
import { ChatRoomMemberEdge } from '../../../../../../graphql/generated.engine';

/**
 * Top section of a chat room, containing the room name members, and submenu icon.
 */
@Component({
  selector: 'm-chatRoom__top',
  styleUrls: ['./chat-room-topbar.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chat-room-topbar.component.html',
  imports: [NgCommonModule, CommonModule],
  standalone: true,
})
export class ChatRoomTopComponent implements OnInit {
  /** Name of the room. (optional: will be derived from room members if not provided) */
  @Input() protected roomName: string;

  /** Members of the room. */
  @Input() protected roomMembers: ChatRoomMemberEdge[] = [];

  constructor(private chatRoomUtilsService: ChatRoomUtilsService) {}

  ngOnInit(): void {
    if (!this.roomName && this.roomMembers.length) {
      this.roomName = this.chatRoomUtilsService.deriveRoomNameFromMembers(
        this.roomMembers
      );
    }
  }
}
