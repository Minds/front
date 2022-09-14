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
}

export = CommonPage;
