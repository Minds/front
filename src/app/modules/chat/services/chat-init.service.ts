import { Injectable } from '@angular/core';
import { Observable, Subscription, distinctUntilChanged, map, of } from 'rxjs';
import {
  InitChatGQL,
  InitChatQuery,
} from '../../../../graphql/generated.engine';
import { Session } from '../../../services/session';
import { QueryRef } from 'apollo-angular';
import { GlobalChatSocketService } from './global-chat-socket.service';

/**
 * Service to aggregate queries used to initialize the chat service.
 */
@Injectable({ providedIn: 'root' })
export class ChatInitService {
  /** The query reference. */
  private _queryRef: QueryRef<InitChatQuery>;

  /** The subscription to get chat room guids. */
  private getChatRoomGuidsSubscription: Subscription;

  constructor(
    private initChatGQL: InitChatGQL,
    private globalChatSocketService: GlobalChatSocketService,
    private session: Session
  ) {}

  /**
   * Initializes the chat init service.
   * @returns { void }
   */
  public init(): void {
    if (!this.session.isLoggedIn()) {
      console.info('Skipping chat socket init as user is not logged in');
      return;
    }

    this.getChatRoomGuidsSubscription = this.getChatRoomGuids$()
      .pipe(distinctUntilChanged())
      .subscribe((roomGuids: string[]): void => {
        this.globalChatSocketService.listenToRoomGuids(roomGuids);
      });
  }

  /**
   * Destroys the chat init service.
   * @returns { void }
   */
  public destroy(): void {
    this?.getChatRoomGuidsSubscription?.unsubscribe();
    this.globalChatSocketService.leaveAllRooms();
  }

  /**
   * Refetches the query.
   * @returns { void }
   */
  public refetch(): void {
    this.getQueryRef().refetch();
  }

  /**
   * Reinitializes the chat init service.
   * @returns { void }
   */
  public reinit(): void {
    this.destroy();
    this.refetch();
    this.init();
  }

  /**
   * Get unread message count.
   * @returns { Observable<number> } - the unread message count.
   */
  public getUnreadCount$(): Observable<number> {
    if (!this.session.isLoggedIn()) {
      return of(null);
    }
    return this.getQueryRef().valueChanges.pipe(
      map(({ data }) => data.chatUnreadMessagesCount)
    );
  }

  /**
   * Get chat room guids.
   * @returns { Observable<string[]> } - the chat room guids.
   */
  public getChatRoomGuids$(): Observable<string[]> {
    if (!this.session.isLoggedIn()) {
      return of([]);
    }
    return this.getQueryRef().valueChanges.pipe(
      map(({ data }) => data.chatRoomGuids)
    );
  }

  /**
   * Gets the query reference or instantiates a new one.
   * @returns { QueryRef<GetChatUnreadCountQuery> } - the query reference.
   */
  private getQueryRef(): QueryRef<InitChatQuery> {
    if (!this._queryRef) {
      this._queryRef = this.initChatGQL.watch();
    }
    return this._queryRef;
  }
}
