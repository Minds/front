const { I } = inject();

export class CommonPage {
  /**
   * Opens the composer from the sidebar
   */
  public openSidebarComposer() {
    I.click('[data-ref=sidenav-composer]');
  }
}
