const { I } = inject();

/**
 * Chat room list component
 */
class ChatRoomListComponent {
  private roomListItemSelector: string =
    '[data-ref=data-minds-chat-room-list-item]';
  private pendingChatRequestsWidget: string =
    '[data-ref=data-minds-chat-pending-requests-button]';
  private pendingChatRequestsCount: string =
    '.m-chatPendingRequestsWidget__requestCount';
  private chatRequestModeBackButton: string =
    '[data-ref=data-minds-chat-request-list-back-button]';

  /**
   * Open the chat room at the given index.
   * @param { number } i - the index of the chat room to open.
   * @return { void }
   */
  public openChatRoomAtIndex(i: number = 1): void {
    I.click(locate(this.roomListItemSelector).at(i));
  }

  /**
   * Check if a chat room with the given name exists.
   * @param { string } text - the text to check for.
   * @return { void }
   */
  public hasRoomWithNameContaining(text: string): void {
    I.seeElement(locate(this.roomListItemSelector).withText(text));
  }

  /**
   * Check if a chat room with the given name does not exist.
   * @param { string } text - the text to check for.
   * @return { void }
   */
  public hasNoRoomWithNameContaining(text: string): void {
    I.dontSeeElement(locate(this.roomListItemSelector).withText(text));
  }

  /**
   * Open the chat room with the name containing the given text.
   * @param { string } text - the text to check for.
   * @return { void }
   */
  public openRoomWithNameContaining(text: string): void {
    I.click(locate(this.roomListItemSelector).withText(text).at(1));
  }

  /**
   * Check if the pending chat requests widget is visible with the given count.
   * @param { number } count - the count to check for.
   * @return { void }
   */
  public hasPendingChatRequestsWidgetWithCount(count: number): void {
    I.seeElement(this.pendingChatRequestsWidget);
    I.seeElement(
      locate(this.pendingChatRequestsCount).withText(count.toString())
    );
  }

  /**
   * Click the pending chat requests widget.
   * @return { void }
   */
  public clickPendingChatRequestsWidget(): void {
    I.click(this.pendingChatRequestsWidget);
  }

  /**
   * Click the back button in chat request mode.
   * @return { void }
   */
  public clickChatRequestModeBackButton(): void {
    I.click(this.chatRequestModeBackButton);
  }
}

export = new ChatRoomListComponent();
