import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import { WireV2Service } from '../../wire-v2.service';
import { SupportTier, SupportTiersService } from '../../support-tiers.service';
import { NewCardModalComponent } from '../../../../payments/new-card-modal/new-card-modal.component';
import { PaymentsSelectCard } from '../../../../payments/select-card/select-card.component';

/**
 * Support tier confirmation component
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
