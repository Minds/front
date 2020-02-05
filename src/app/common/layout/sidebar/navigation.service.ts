import { Injectable } from '@angular/core';
import { SidebarNavigationComponent } from './navigation.component';

@Injectable()
export class SidebarNavigationService {
  container: SidebarNavigationComponent;

  static _() {
    return new SidebarNavigationService();
  }

  setContainer(container: SidebarNavigationComponent) {
    this.container = container;
  }

  toggle() {
    if (this.container) {
      this.container.toggle();
    }
  }
}
