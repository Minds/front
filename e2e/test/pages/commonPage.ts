const { I } = inject();

class CommonPage {
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

export = new CommonPage();
