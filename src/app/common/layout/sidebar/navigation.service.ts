import { Injectable } from '@angular/core';
import { SidebarNavigationComponent } from './navigation.component';

@Injectable()
export class SidebarNavigationService {
  container: SidebarNavigationComponent;

  setContainer(container: SidebarNavigationComponent) {
    this.container = container;
  }

  toggle(): void {
    if (this.container) {
      this.container.toggle();
    }
  }
}
