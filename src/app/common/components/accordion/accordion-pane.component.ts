import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
} from '@angular/core';

/**
 * Accordion pane component. Should be inside <m-accordion>.
 */
@Component({
  selector: 'm-accordion__pane',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'accordion-pane.component.html',
})
export class AccordionPaneComponent {
  /**
   * Pane title
   */
  @Input() headerTitle: string;

  /**
   * Is the pane opened? (shown)
   */
  opened: boolean = false;

  /**
   * Emits when a pane header is clicked
   */
  toggleEmitter: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Constructor
   * @param cd
   */
  constructor(protected cd: ChangeDetectorRef) {}

  /**
   * Sets the opened flag and detect changes
   * @param opened
   */
  setOpened(opened: boolean): AccordionPaneComponent {
    this.opened = opened;
    this.detectChanges();
    return this;
  }

  /**
   * Binds opened flag to a class
   */
  @HostBinding('class.m-accordion__pane--opened')
  get isPaneOpened() {
    return this.opened;
  }

  /**
   * Triggers manual change detection
   */
  protected detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
