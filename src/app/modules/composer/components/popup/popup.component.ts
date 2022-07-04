import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  EventEmitter,
  HostBinding,
  Injector,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { DynamicHostDirective } from '../../../../common/directives/dynamic-host.directive';

interface DismissIntentAbleComponent {
  dismissIntent: EventEmitter<any>;
}

/**
 * Popup component to display composer panels on top of the composer base.
 * It should be used as a singleton component in the root element.
 * It relies on Popup Service for inter-component communication.
 */
@Component({
  selector: 'm-composer__popup',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'popup.component.html',
})
export class PopupComponent {
  /**
   * Is the popup open and shown?
   */
  @HostBinding('class.m-composer__popup--open') open: boolean = false;

  /**
   * Placeholder for child component injection
   */
  @ViewChild(DynamicHostDirective, { static: true })
  protected host: DynamicHostDirective;

  /**
   * Injected component's ref
   */
  protected componentRef: ComponentRef<unknown>;

  /**
   * Current popup execution scope
   */
  protected current: Observable<any>;

  constructor(
    protected cd: ChangeDetectorRef,
    protected componentFactoryResolver: ComponentFactoryResolver
  ) {}

  /**
   * Creates a component instance and injects it onto the placeholder. The component *MUST* have a `dismissIntent` @Output
   * to let us know we should clean up and destroy.
   * @param component
   * @param injector
   */
  create<C extends DismissIntentAbleComponent>(
    component: Type<C>,
    injector: Injector
  ): PopupComponent {
    // Dismisses the modal, if open
    this.dismiss();

    if (!component) {
      throw new Error('Invalid component class');
    }

    // Instantiate component and inject it
    const componentFactory: ComponentFactory<C> = this.componentFactoryResolver.resolveComponentFactory(
      component
    );
    const viewContainerRef: ViewContainerRef = this.host.viewContainerRef;

    viewContainerRef.clear();

    const componentRef: ComponentRef<C> = viewContainerRef.createComponent(
      componentFactory,
      void 0,
      injector
    );

    // Setup popup execution scope, for now it dismisses itself when a dismissIntent is received
    // TODO: Allow "progress-like" messages that won't dismiss the modal. Use a different @Output for backwards-compat!

    this.current = new Observable(subscriber => {
      try {
        if (!componentRef.instance.dismissIntent) {
          // Check if component has a dismissIntent EventEmitter
          throw new Error(
            'Component instance is missing required `dismissIntent` EventEmitter'
          );
        } else if (
          !(componentRef.instance.dismissIntent instanceof EventEmitter)
        ) {
          // Check if component's dismissIntent is actually an EventEmitter
          throw new Error(
            'Component instance `dismissIntent` is not an EventEmitter'
          );
        } else {
          this.open = true;
          this.detectChanges();

          // Set up dismissIntent EventEmitter subscription
          const dismissIntentSubscription: Subscription = componentRef.instance.dismissIntent.subscribe(
            payload => {
              try {
                // Emit and complete
                subscriber.next(payload);
                subscriber.complete();

                // Dismiss the modal
                this.dismiss();
              } catch (e) {
                // Throw an error
                subscriber.error(e);

                // Dismiss the modal
                this.dismiss();
              }
            }
          );

          // Return a clean up function
          return () => {
            try {
              // Unsubscribe from dismissIntent EventEmitter
              dismissIntentSubscription.unsubscribe();

              // Dismiss the modal
              this.dismiss();
            } catch (e) {
              console.warn('PopupComponent.present.$.unsubscribe', e);
            }
          };
        }
      } catch (e) {
        // Warning, because it's out of the ordinary
        console.warn('PopupComponent.present.$', e);

        // Throw an error
        subscriber.error(e);

        // Dismiss the modal
        this.dismiss();
      }
    });

    // Set component ref (for clean-up)
    this.componentRef = componentRef;

    return this;
  }

  /**
   * Returns the popup modal execution scope. The popup is managed by a COLD observable, so it'll
   * open as soon as something subscribes to it.
   *
   * Pro tip: .present().toPromise() shows it immediately.
   */
  present<C>(): Observable<C> {
    if (!this.componentRef) {
      throw new Error('Invalid component ref');
    }

    return this.current;
  }

  /**
   * Hides the popup modal, without destroying it
   */
  hide(): void {
    // TODO: Animate and return a promise/Observer (observable would be better, because it's cancellable)
    this.open = false;
    this.detectChanges();
  }

  /**
   * Dismisses and destroys the modal, frees all resources. But... ensure your component unsubscribes!
   */
  dismiss(kill: boolean = false): void {
    if (!kill) {
      // TODO: Try to await for animation
      this.hide();
    }

    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = void 0;
    }

    this.current = void 0;
    this.host.viewContainerRef.clear();
  }

  /**
   * Detects changes
   */
  detectChanges(): void {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
