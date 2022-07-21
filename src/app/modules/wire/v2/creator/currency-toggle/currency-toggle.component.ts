import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import { WireV2Service } from '../../wire-v2.service';

/**
 * Allows users to toggle between USD and tokens when making a payment
 */
@Component({
  selector: 'm-wireCreator__currencyToggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'currency-toggle.component.html',
  styleUrls: ['currency-toggle.component.ng.scss'],
})
export class WireCreatorCurrencyToggleComponent {
  /**
   * Constructor
   * @param service
   */
  constructor(public service: WireV2Service, private cd: ChangeDetectorRef) {}

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
