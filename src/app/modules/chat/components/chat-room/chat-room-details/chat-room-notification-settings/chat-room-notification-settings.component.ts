import { CommonModule as NgCommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '../../../../../../common/common.module';
import {
  BehaviorSubject,
  Subscription,
  filter,
  firstValueFrom,
  lastValueFrom,
} from 'rxjs';
import { SingleChatRoomService } from '../../../../services/single-chat-room.service';
import {
  ChatRoomEdge,
  ChatRoomNotificationStatusEnum,
  GetChatRoomNotificationStatusDocument,
  GetChatRoomNotificationStatusQuery,
  UpdateChatRoomNotificationSettingsGQL,
  UpdateChatRoomNotificationSettingsMutation,
} from '../../../../../../../graphql/generated.engine';
import {
  DEFAULT_ERROR_MESSAGE,
  ToasterService,
} from '../../../../../../common/services/toaster.service';
import { MutationResult } from 'apollo-angular';
import { InMemoryCache } from '@apollo/client';
import { cloneDeep } from '@apollo/client/utilities';

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
  /** Enum for use in template. */
  protected readonly ChatRoomNotificationStatusEnum: typeof ChatRoomNotificationStatusEnum =
    ChatRoomNotificationStatusEnum;

  /** Whether notifications are muted. */
  protected readonly notificationsMuted$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /** Subscription to chat room. */
  private chatRoomSubscription: Subscription;

  constructor(
    private singleChatRoomService: SingleChatRoomService,
    private updateChatRoomNotificationSettingsGql: UpdateChatRoomNotificationSettingsGQL,
    private toaster: ToasterService
  ) {}

  ngOnInit(): void {
    this.chatRoomSubscription = this.singleChatRoomService.chatRoom$
      .pipe(filter(Boolean))
      .subscribe((chatRoom: ChatRoomEdge) => {
        this.notificationsMuted$.next(
          chatRoom.node.chatRoomNotificationStatus ===
            ChatRoomNotificationStatusEnum.Muted
        );
      });
  }

  ngOnDestroy(): void {
    this.chatRoomSubscription?.unsubscribe();
  }

  /**
   * Handle mute notifications toggle. This is a binary toggle initially but in future
   * we will need to deprecate this, and the toggle system to account for other enum values.
   * @param { value } value - whether notifications are muted.
   * @returns { Promise<void> }
   */
  protected async onMuteNotificationToggle(value: boolean): Promise<void> {
    const previousValue: boolean = this.notificationsMuted$.getValue();
    const chatRoom: ChatRoomEdge = await firstValueFrom(
      this.singleChatRoomService.chatRoom$
    );

    this.notificationsMuted$.next(value);

    try {
      const result: MutationResult<UpdateChatRoomNotificationSettingsMutation> =
        await lastValueFrom(
          this.updateChatRoomNotificationSettingsGql.mutate(
            {
              roomGuid: chatRoom?.node?.guid,
              notificationStatus: value
                ? ChatRoomNotificationStatusEnum.Muted
                : ChatRoomNotificationStatusEnum.All,
            },
            {
              update: this.handleNotificationStatusChange.bind(this),
            }
          )
        );

      if (result?.errors?.length) {
        throw new Error(result.errors[0].message);
      }

      if (!result.data.updateNotificationSettings) {
        throw new Error(DEFAULT_ERROR_MESSAGE);
      }
    } catch (e) {
      console.error(e);
      this.toaster.error(e);
      this.notificationsMuted$.next(previousValue);
    }
  }

  /**
   * Handle notification status change.
   * @param { InMemoryCache } cache - cache.
   * @param { MutationResult<UpdateChatRoomNotificationSettingsMutation> } result - mutation result.
   * @param { any } options - options.
   * @returns { void }
   */
  private handleNotificationStatusChange(
    cache: InMemoryCache,
    result: MutationResult<UpdateChatRoomNotificationSettingsMutation>,
    options: any
  ): void {
    if (!result?.data?.updateNotificationSettings) return;

    let newValue: GetChatRoomNotificationStatusQuery = cloneDeep(
      cache.readQuery<GetChatRoomNotificationStatusQuery>({
        query: GetChatRoomNotificationStatusDocument,
        variables: {
          roomGuid: options?.variables?.roomGuid,
        },
      })
    );

    newValue.chatRoom.node.chatRoomNotificationStatus =
      options?.variables?.notificationStatus;

    cache.writeQuery({
      query: GetChatRoomNotificationStatusDocument,
      variables: {
        roomGuid: options?.variables?.roomGuid,
      },
      data: newValue,
    });
  }
}
