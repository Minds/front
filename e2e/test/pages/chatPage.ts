const { I, sidebarComponent } = inject();

/**
 * Chat page.
 */
class ChatPage {
  private readonly createNewChatButtonSelector: string =
    '[data-ref=data-minds-chat-room-list-new-chat-button]';

  /**
   * Navigate to Chat via the sidebar.
   * @returns { void }
   */
  public openViaSidebar(): void {
    sidebarComponent.openChat();
  }

  /**
   * Click the create new chat button.
   * @return { void }
   */
  public clickCreateNewChatButton(): void {
    I.click(this.createNewChatButtonSelector);
  }
}

export = new ChatPage();
