const { I } = inject();

export class CommonPage {
  toaster: 'm-toaster';

  openSidebarComposer() {
    I.click('[data-ref=sidenav-composer]');
  }
  /**
   * Toasters
   */
  toasterTypePrefix() {
    return `${this.toaster} .m-toaster__iconWrapper--`;
  }
}
