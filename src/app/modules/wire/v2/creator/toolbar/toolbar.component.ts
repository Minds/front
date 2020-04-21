import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { WireV2Service } from '../../wire-v2.service';

/**
 * Bottom toolbar for Wire modal
 */
@Component({
  selector: 'm-wireCreator__toolbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'toolbar.component.html',
})
export class WireCreatorToolbarComponent {
  /**
   * Constructor
   * @param service
   */
  constructor(public service: WireV2Service) {}

  /**
   * Submit intent
   */
  @Output('onSubmit') onSubmitEmitter: EventEmitter<void> = new EventEmitter<
    void
  >();

  /**
   * Submit button event handler
   * @param $event
   */
  onSubmitClick($event?: MouseEvent): void {
    this.onSubmitEmitter.emit();
  }
}
