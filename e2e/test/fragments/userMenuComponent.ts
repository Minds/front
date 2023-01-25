const { I } = inject();

/**
 * Top bar user menu component.
 */
class UserMenuComponent {
  // selectors.
  private readonly userMenuTrigger: string = '[data-ref=topnav-avatar]';
  private readonly boostConsoleButtonSelector: string =
    '[data-ref=topnav-usermenu-boostconsole]';

  /**
   * Click avatar to open menu.
   * @return { void }
   */
  public openMenu(): void {
    I.waitForElement(this.userMenuTrigger);
    I.click(this.userMenuTrigger);
  }

  /**
   * Opens the boost console from user menu.
   * @return { void }
   */
  public openBoostConsole(): void {
    I.waitForElement(this.boostConsoleButtonSelector);
    I.click(this.boostConsoleButtonSelector);
  }
}

export = new UserMenuComponent();
