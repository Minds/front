require('dotenv').config();
const { I } = inject();

class CommonPage {
  /**
   * Opens the composer from the sidebar
   */
  public openSidebarComposer(): void {
    I.click('[data-ref=sidenav-composer]');
  }
}

export = CommonPage;
