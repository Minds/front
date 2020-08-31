import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { DynamicHostDirective } from '../../directives/dynamic-host.directive';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { OverlayModalComponent } from '../overlay-modal/overlay-modal.component';
import {
  StackableModalService,
  StackableModalEvent,
  StackableModalState,
} from '../../../services/ux/stackable-modal.service';

/**
 * When you need to stack a modal
 * on top of the overlay modal
 */
@Component({
  selector: 'm-stackableModal',
  templateUrl: './stackable-modal.component.html',
  providers: [OverlayModalService],
})
export class StackableModalComponent implements AfterViewInit {
  @ViewChild(DynamicHostDirective, { static: true })
  private host: DynamicHostDirective;
  public hidden: boolean = true;

  private compRef: ComponentRef<{}>;
  private compInstance;

  constructor(
    private _componentFactoryResolver: ComponentFactoryResolver,
    public overlayModalService: OverlayModalService,
    private stackableModalService: StackableModalService
  ) {}

  ngAfterViewInit() {
    /**
     * Dynamically create another overlay modal for stacking
     */
    this.stackableModalService.setContainer(this);
  }

  createDynamicOverlayModal(): OverlayModalComponent {
    if (this.compInstance) {
      this.dismiss();
    }

    /**
     * Create a factory for the dynamic overlay modal
     */
    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(
      OverlayModalComponent
    );

    /**
     * Use the factory to create a new overlay modal component
     */
    this.compRef = this.host.viewContainerRef.createComponent(
      componentFactory,
      void 0
    );

    this.compInstance = this.compRef.instance;

    return this.compInstance;
  }

  /**
   * Dismiss the stackable modal
   */
  dismiss(): void {
    this.hidden = true;

    if (this.compInstance) {
      this.compRef.destroy();
      this.host.viewContainerRef.clear();
    }
  }

  /**
   * Don't let clicks affect what's underneath the modal
   */
  onClick($event) {
    $event.stopPropagation();
  }
}
