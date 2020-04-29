import { SidebarMarkersComponent } from './markers.component';

export class SidebarMarkersService {
  private container: SidebarMarkersComponent;

  static _() {
    return new SidebarMarkersService();
  }

  setContainer(container: SidebarMarkersComponent) {
    this.container = container;

    return this;
  }

  toggleVisibility(visible: boolean) {
    this.container.checkSidebarVisibility(visible);
  }
}
