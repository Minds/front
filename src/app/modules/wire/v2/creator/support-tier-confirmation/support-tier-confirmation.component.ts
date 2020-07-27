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
import {
  StackableModalService,
  StackableModalEvent,
} from '../../../../../services/ux/stackable-modal.service';
import { NewCardModalComponent } from '../../../../payments/new-card-modal/new-card-modal.component';
import { PaymentsSelectCard } from '../../../../payments/select-card/select-card.component';

/**
 * Support tier confirmation component
 */
@Component({
  selector: 'm-wireCreator__supportTierConfirmation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'support-tier-confirmation.component.html',
  styleUrls: ['support-tier-confirmation.component.ng.scss'],
})
export class WireCreatorSupportTierConfirmationComponent {
  /**
   * Dismiss intent event emitter
   */
  @Output('onDismissIntent') dismissIntentEmitter: EventEmitter<
    void
  > = new EventEmitter<void>();

  @ViewChild(PaymentsSelectCard) cardSelector: PaymentsSelectCard;

  /**
   * Constructor
   * @param service
   * @param shop
   */
  constructor(
    public service: WireV2Service,
    public supportTiersService: SupportTiersService,
    private stackableModal: StackableModalService,
    private cd: ChangeDetectorRef
  ) {}

  /**
   * Triggers the dismiss modal event
   */
  dismiss() {
    this.dismissIntentEmitter.emit();
  }

  /**
   * Compare 2 support tiers by their URN. Used by <select>
   * @param a
   * @param b
   */
  byUrn(a: SupportTier, b: SupportTier) {
    return a && b && a.urn === b.urn;
  }

  onAddCardClick(e: MouseEvent): void {
    this.cardSelector.onAddNewCard();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
