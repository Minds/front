import { SidebarNavigationComponent } from './navigation.component';

export class SidebarNavigationService {
  container: SidebarNavigationComponent;

  setContainer(container: SidebarNavigationComponent): void {
    this.container = container;
  }

  toggle(): void {
    if (this.container) {
      this.container.toggle();
    }
  }
}
