import { SidebarNavigationComponent } from './navigation.component';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SidebarNavigationV2Component } from './navigation-v2/navigation-v2.component';

@Injectable()
export class SidebarNavigationService {
  container: SidebarNavigationComponent | SidebarNavigationV2Component;
  visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  // Relates to sidebar state on mobile
  isOpened$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  setContainer(
    container: SidebarNavigationComponent | SidebarNavigationV2Component
  ): void {
    this.container = container;
  }

  toggle(): void {
    this.isOpened$.next(!this.isOpened$.getValue());
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
