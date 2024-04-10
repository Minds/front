import { CommonModule as NgCommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '../../../../../../common/common.module';
import { BehaviorSubject, Subscription, filter } from 'rxjs';
import { SingleChatRoomService } from '../../../../services/single-chat-room.service';
import { ChatRoomEdge } from '../../../../../../../graphql/generated.engine';

/**
 * Notification settings for a chat room.
 */
@Component({
  selector: 'm-chatRoom__notificationSettings',
  styleUrls: ['./chat-room-notification-settings.component.ng.scss'],
  templateUrl: './chat-room-notification-settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgCommonModule, CommonModule],
  standalone: true,
})
export class ChatRoomNotificationSettingsComponent implements OnInit {
  /** Whether notifications are muted. */
  protected readonly notificationsMuted$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /** Subscription to chat room. */
  private chatRoomSubscription: Subscription;

  constructor(private singleChatRoomService: SingleChatRoomService) {}

  ngOnInit(): void {
    this.chatRoomSubscription = this.singleChatRoomService.chatRoom$
      .pipe(filter(Boolean))
      .subscribe((chatRoom: ChatRoomEdge) => {
        this.notificationsMuted$.next(
          chatRoom.node.areChatRoomNotificationsMuted
        );
      });
  }

  ngOnDestroy(): void {
    this.chatRoomSubscription?.unsubscribe();
  }

  /**
   * Handle mute notifications toggle.
   * @param { boolean } value - Whether notifications are muted.
   * @returns { void }
   */
  protected onMuteNotificationToggle(value: boolean): void {
    this.notificationsMuted$.next(value);
    // TODO: Save to server
  }
}
