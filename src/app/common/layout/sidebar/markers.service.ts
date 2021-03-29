import { SidebarMarkersInterface } from './markers.interface';

export class SidebarMarkersService {
  private container: SidebarMarkersInterface;

  static _() {
    return new SidebarMarkersService();
  }

  setContainer(container: SidebarMarkersInterface) {
    this.container = container;

    return this;
  }

  toggleVisibility(visible: boolean) {
    this.container.checkSidebarVisibility(visible);
  }
}
