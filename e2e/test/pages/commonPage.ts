const { I } = inject();

export class CommonPage {
  public toaster: string = 'm-toaster';

  openSidebarComposer() {
    I.click('[data-ref=sidenav-composer]');
  }
  /**
   * Toasters
   */
  get toasterTypePrefix() {
    return `${this.toaster} .m-toaster__iconWrapper--`;
  }
}
