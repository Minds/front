const { I } = inject();

/**
 * Main nav sidebar component.
 */
class SidebarComponent {
  // selectors.
  private readonly composerButtonSelector: string =
    '[data-ref=sidenav-composer]';
  private readonly channelButtonSelector: string = '[data-ref=sidenav-channel]';
  private readonly moreButtonSelector: string = '[data-ref=sidenav-more]';
  private readonly supermindConsoleButtonSelector: string =
    '[data-ref=sidenav-supermind]';
  private readonly walletButtonSelector: string = '[data-ref=sidenav-wallet]';
  private chatButtonSelector: string = '[data-ref=sidenav-chat]';

  /**
   * Opens the users channel from the sidebar.
   * @return { void }
   */
  public openChannel(): void {
    I.waitForElement(this.channelButtonSelector);
    I.click(this.channelButtonSelector);
    I.waitForElement('m-channel__feed');
  }

  /**
   * Opens the composer from the sidebar.
   * @return { void }
   */
  public openSidebarComposer(): void {
    I.waitForElement(this.composerButtonSelector);
    I.click(this.composerButtonSelector);
  }

  /**
   * Click expand more in sidebar.
   * @return { void }
   */
  public expandSidebarMore(): void {
    I.waitForElement(this.moreButtonSelector);
    I.click(this.moreButtonSelector);
  }

  public openWallet(): void {
    I.waitForElement(this.walletButtonSelector);
    I.click(this.walletButtonSelector);
  }

  /**
   * Open supermind console (requires sidebar more to be opened).
   * @return { void }
   */
  public openSupermindConsole(): void {
    I.waitForElement(this.supermindConsoleButtonSelector);
    I.click(this.supermindConsoleButtonSelector);
  }

  /**
   * Open chat from sidebar.
   * @return { void }
   */
  public openChat(): void {
    I.click(this.chatButtonSelector);
  }
}

export = new SidebarComponent();
