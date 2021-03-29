import { SidebarNavigationInterface } from './navigation.interface';
import { EventEmitter } from '@angular/core';

export class SidebarNavigationService {
  container: SidebarNavigationInterface;
  visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  setContainer(container: SidebarNavigationInterface): void {
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
