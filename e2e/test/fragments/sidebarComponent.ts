const { I } = inject();

/**
 * Main nav sidebar component.
 */
class SidebarComponent {
  // selectors.
  private readonly sidebarComposerItemSelector: string =
    '[data-ref=sidenav-composer]';

  /**
   * Opens the users channel from the sidebar.
   * @return { void }
   */
  public openChannel(): void {
    I.click('[data-ref=sidenav-channel]');
    I.waitForElement('m-channel__feed');
  }

  /**
   * Opens the composer from the sidebar.
   * @return { void }
   */
  public openSidebarComposer(): void {
    I.waitForElement(this.sidebarComposerItemSelector);
    I.click(this.sidebarComposerItemSelector);
  }

  /**
   * Click expand more in sidebar.
   * @return { void }
   */
  public expandSidebarMore(): void {
    I.click('[data-ref=sidenav-more]');
  }

  /**
   * Open supermind console (requires sidebar more to be opened).
   * @return { void }
   */
  public openSupermindConsole(): void {
    I.click('[data-ref=sidebarmore-supermind]');
  }
}

export = new SidebarComponent();
