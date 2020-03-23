import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Injector,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { ComposerService } from './services/composer.service';
import { ModalService } from './components/modal/modal.service';
import { BaseComponent } from './components/base/base.component';

/**
 * Wrapper component for composer. It can hold an embedded base composer
 * or a placeholder-like non-interactive copy that will open a floating modal
 */
@Component({
  providers: [ComposerService],
  selector: 'm-composer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'composer.component.html',
})
export class ComposerComponent implements OnDestroy {
  /**
   * Is this an embedded composer (i.e. no modal)
   */
  @Input() embedded: boolean = false;

  /**
   * Input activity (for edits)
   * @param activity
   * @private
   */
  @Input('activity') set _activity(activity: any) {
    if (activity) {
      this.service.load(activity);
    }
  }

  /**
   * Container GUID (group context)
   * @param containerGuid
   * @private
   */
  @Input('containerGuid') set _containerGuid(containerGuid: any) {
    if (typeof containerGuid !== 'undefined') {
      this.service.setContainerGuid(containerGuid);
    }
  }

  /**
   * Post event emitter
   */
  @Output('onPost') onPostEmitter: EventEmitter<any> = new EventEmitter<any>();

  /**
   * Posting error event emitter
   */
  @Output('onPostError') onPostErrorEmitter: EventEmitter<
    any
  > = new EventEmitter<any>();

  /**
   * Is the modal open?
   */
  modalOpen: boolean = false;

  /**
   * Embedded composer ref
   */
  @ViewChild('embeddedBaseComposer', { static: false })
  protected embeddedBaseComposer: BaseComponent;

  /**
   * Popup placeholder composer ref
   */
  @ViewChild('popOutBaseComposer', { static: false })
  protected popOutBaseComposer: BaseComponent;

  /**
   * Was this component destroyed (yes, it can happen)
   */
  protected destroyed: boolean = false;

  /**
   * Constructor
   * @param modalService
   * @param service
   * @param cd
   * @param injector
   */
  constructor(
    protected modalService: ModalService,
    protected service: ComposerService /* NOTE: Used for DI. DO NOT REMOVE OR CHANGE !!! */,
    protected cd: ChangeDetectorRef,
    protected injector: Injector
  ) {}

  /**
   * Component destroy hook
   */
  ngOnDestroy(): void {
    this.destroyed = true;
    this.modalService.dismiss();
  }

  /**
   * Opens the modal when the placeholder is clicked
   * @param $event
   */
  async onTriggerClick($event: MouseEvent) {
    this.modalOpen = true;
    this.detectChanges();

    try {
      const $event = await this.modalService
        .setInjector(this.injector)
        .present()
        .toPromise();

      if (this.destroyed) {
        // If the component was destroyed (i.e navigated away), do nothing
        return;
      }

      if ($event) {
        this.onPostEmitter.emit($event);
      }
    } catch (e) {
      console.error('Composer.onTriggerClick', e);
      this.onPostErrorEmitter.emit(e);
    }

    this.modalOpen = false;
    this.detectChanges();
  }

  /**
   * Can navigate away? Children base components are responsible for asking
   */
  canDeactivate(): boolean | Promise<boolean> {
    if (this.popOutBaseComposer) {
      return this.popOutBaseComposer.canDeactivate();
    }

    if (this.embeddedBaseComposer) {
      return this.embeddedBaseComposer.canDeactivate();
    }

    return true;
  }

  /**
   * Detect changes. Do nothing if component is destroyed.
   */
  detectChanges() {
    if (this.destroyed) {
      return;
    }

    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
