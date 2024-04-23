const { I } = inject();

/**
 * Create New Chat Modal Component
 */
class CreateNewChatModalComponent {
  private readonly searchInputSelector: string = `[data-ref=data-minds-start-chat-modal-search-typeahead] #searchTerm`;
  private readonly searchResultSelector: string = `[data-ref=data-minds-start-chat-modal-user-row]`;
  private readonly startChatButtonSelector: string = `[data-ref=data-minds-start-chat-button]`;

  /**
   * Search for a user by username.
   * @param { string } username - the username to search for.
   * @return { void }
   */
  public searchForUser(username: string): void {
    I.fillField(this.searchInputSelector, username);
  }

  /**
   * Select a user by username.
   * @param { string } username - the username to select.
   * @return { void }
   */
  public selectUserByUsername(username: string): void {
    I.click(locate(this.searchResultSelector).withText(username));
  }

  /**
   * Click the start chat button.
   * @return { void }
   */
  public clickStartChatButton(): void {
    I.click(this.startChatButtonSelector);
  }
}

export = new CreateNewChatModalComponent();
