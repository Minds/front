import { within } from 'codeceptjs';

const { I } = inject();

/**
 * Chat room component
 */
class ChatRoomComponent {
  private readonly textInputSelector: string =
    '[data-ref=data-minds-chat-message-input]';
  private readonly sendButtonSelector: string =
    '[data-ref=data-minds-chat-send-message-button]';
  private readonly chatMessageSelector: string =
    '[data-ref=data-minds-chat-message]';
  private readonly chatRoomSettingsButtonSelector: string =
    '[data-ref=data-minds-chat-room-settings-button]';
  private readonly chatRoomInfoDeleteChatButton: string =
    '[data-ref=data-minds-chat-info-delete-button]';
  private readonly richEmbedUrlSelector: string =
    '[data-ref=data-minds-chat-room-embed-url-text]';
  private readonly richEmbedSelector: string =
    '[data-ref=data-minds-chat-room-message-rich-embed]';
  private readonly acceptChatRequestButton: string =
    '[data-ref=data-minds-chat-request-accept-button]';

  /**
   * Type a message in the chat room.
   * @param { string } message - the message to type.
   * @return { void }
   */
  public typeMessage(message: string): void {
    I.fillField(this.textInputSelector, message);
  }

  /**
   * Send the message in the chat room.
   * @return { void }
   */
  public sendMessage(): void {
    I.clickAndWait(locate(this.sendButtonSelector), '/api/graphql', 200);
  }

  /**
   * Check if the last message in the chat room has the given text.
   * @param { string } message - the message to check for.
   * @return { void }
   */
  public hasLastMessageWithText(message: string): void {
    I.seeElement(locate(this.chatMessageSelector).last().withText(message));
  }

  /**
   * Click the chat room settings button.
   * @return { void }
   */
  public clickChatRoomSettingsButton(): void {
    I.click(this.chatRoomSettingsButtonSelector);
  }

  /**
   * Click the delete chat button.
   * @return { void }
   */
  public clickDeleteChatButton(): void {
    I.click(this.chatRoomInfoDeleteChatButton);
  }

  /**
   * Wait for the rich embed to load.
   * @return { void }
   */
  public waitForRichEmbed(): void {
    I.waitForElement(this.richEmbedSelector);
  }

  /**
   * Check if the last message in the chat room has a rich embed with the given URL.
   * @param { string } url - the URL to check for.
   */
  public hasRichEmbedWithUrlInLastMessage(url: string): void {
    within(locate(this.chatMessageSelector).last(), () => {
      I.waitForElement(locate(this.richEmbedUrlSelector).withText(url));
    });
  }

  /**
   * Click the accept chat request button.
   * @return { void }
   */
  public clickAcceptChatRequestButton(): void {
    I.clickAndWait(
      locate(this.acceptChatRequestButton).withText('Accept'),
      '/api/graphql',
      200
    );
  }
}

export = new ChatRoomComponent();
