const { I } = inject();

/**
 * Main nav sidebar component.
 */
class SidebarComponent {
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
    I.click('[data-ref=sidenav-composer]');
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
