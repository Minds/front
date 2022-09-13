require('dotenv').config();
const { I } = inject();

class CommonPage {
  /**
   * Toasters
   */
  get toaster(): string {
    return 'm-toaster';
  }
  get toasterTypePrefix(): string {
    return `${this.toaster} .m-toaster__iconWrapper--`;
  }

  /**
   * Opens the composer from the sidebar
   */
  public openSidebarComposer(): void {
    I.click('[data-ref=sidenav-composer]');
  }
}

export = CommonPage;
