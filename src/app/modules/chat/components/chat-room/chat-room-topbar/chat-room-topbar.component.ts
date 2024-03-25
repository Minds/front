import { CommonModule as NgCommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '../../../../../common/common.module';
import { ChatRoomUtilsService } from '../../../services/utils.service';
import { ChatRoomMemberEdge } from '../../../../../../graphql/generated.engine';
import { RouterModule } from '@angular/router';
import { WINDOW } from '../../../../../common/injection-tokens/common-injection-tokens';

/**
 * Top section of a chat room, containing the room name members, and submenu icon.
 */
@Component({
  selector: 'm-chatRoom__top',
  styleUrls: ['./chat-room-topbar.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chat-room-topbar.component.html',
  imports: [NgCommonModule, CommonModule, RouterModule],
  standalone: true,
})
export class ChatRoomTopComponent implements OnChanges {
  /** Name of the room. (optional: will be derived from room members if not provided) */
  @Input() protected roomName: string;

  /** Members of the room. */
  @Input() protected roomMembers: ChatRoomMemberEdge[] = [];

  @Input() protected requestMode: boolean = false;

  /** Fires on details icon click. */
  @Output('detailsIconClick') protected detailsIconClickEmitter: EventEmitter<
    void
  > = new EventEmitter<void>();

  constructor(
    private chatRoomUtilsService: ChatRoomUtilsService,
    @Inject(WINDOW) private window: Window
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.roomMembers.currentValue !== changes.roomMembers.previousValue
    ) {
      this.deriveRoomNameFromMembers();
    }
  }

  /**
   * Handles middle mouse click on an avatar by opening the users channel
   * in a new tab.
   */
  protected openChannelInNewTab(username: string): void {
    this.window.open(`/${username}`, '_blank');
  }

  /**
   * Derives room name from members.
   * @returns { void }
   */
  private deriveRoomNameFromMembers(): void {
    if (this.roomMembers.length) {
      this.roomName = this.chatRoomUtilsService.deriveRoomNameFromMembers(
        this.roomMembers
      );
    }
  }
}
