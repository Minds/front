import { Injectable, Injector, OnDestroy } from '@angular/core';
import { PopupComponent } from './popup.component';

/**
 * Popup service that acts as a bridge between the singleton popup component
 * and the caller.
 */
@Injectable()
export class PopupService implements OnDestroy {
  /**
   * Target popup component instance
   */
  protected container: PopupComponent;

  /**
   * Injector tree for dependencies
   */
  protected injector: Injector;

  /**
   * Sets popup service up with a container popup component and an injector tree
   * @param container
   * @param injector
   */
  setUp(container: PopupComponent, injector: Injector): PopupService {
    this.container = container;
    this.injector = injector;
    return this;
  }

  /**
   * Creates a component instance and injects it as a child onto the popup component
   * @param component
   */
  create(component): PopupService {
    if (!this.container) {
      throw new Error('No container set up');
    } else if (!this.injector) {
      throw new Error('No container injector set up');
    }

    this.container.create(component, this.injector);

    return this;
  }

  /**
   * Presents the popup component and its injected child component
   */
  present() {
    if (!this.container) {
      throw new Error('No container set up');
    }

    return this.container.present();
  }

  /**
   * Hides the popup component. The popup is *NOT* destroyed and the observable won't complete.
   */
  hide(): void {
    if (!this.container) {
      throw new Error('No container set up');
    }

    return this.container.hide();
  }

  /**
   * Closes the popup component. The popup is destroyed and the observable is completed.
   */
  close(): void {
    if (!this.container) {
      throw new Error('No container set up');
    }

    return this.container.dismiss();
  }

  /**
   * Cleans up
   */
  ngOnDestroy(): void {
    if (this.container) {
      this.container.dismiss(true);
    }
  }
}
