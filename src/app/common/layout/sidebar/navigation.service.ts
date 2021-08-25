import { SidebarNavigationComponent } from './navigation.component';
import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class SidebarNavigationService {
  container: SidebarNavigationComponent;
  visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  setContainer(container: SidebarNavigationComponent): void {
    this.container = container;
  }

  toggle(): void {
    if (this.container) {
      this.container.toggle();
    }
  }

  isVisible() {
    return this.container ? !this.container.hidden : false;
  }

  setVisible(value: boolean) {
    if (this.container) {
      this.container.setVisible(value);
      this.visibleChange.emit(value);
    }
  }
}
