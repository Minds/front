import { V2TopbarComponent } from './v2-topbar.component';

export class V2TopbarService {
  private container: V2TopbarComponent;

  static _() {
    return new V2TopbarService();
  }

  setContainer(container: V2TopbarComponent) {
    this.container = container;

    return this;
  }

  toggleMarketingPages(value: boolean, showBottombar: boolean = true) {
    if (this.container) {
      this.container.toggleMarketingPages(value, showBottombar);
    }
  }
}
