import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import { WireV2Service } from '../../wire-v2.service';
import {
  SupportTier,
  SupportTierCurrency,
  SupportTiersService,
} from '../../support-tiers.service';
import { PaymentsSelectCard } from '../../../../payments/select-card/select-card.component';
import { Observable, combineLatest, Subscription } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';

/**
 * A variation of the tip modal (aka wire creator) that is shown when
 * a user is joining a membership from another user's shop page.
 *
 * Contains a dropdown of membership tiers, descriptions of the selected tier,
 * and a currency toggle.
 *
 * Allows paying user to select/set up a payment method if they haven't done so already.
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

  supportTiers$: Observable<SupportTier[]> = combineLatest(
    this.supportTiersService.groupedList$,
    this.service.type$
  ).pipe(
    map(([supportTiers, type]) => {
      return supportTiers[type];
    })
  );

  /**
   * Payment types as array of support tier currencies e.g. ['usd', 'tokens']
   * @returns { Observable<SupportTierCurrency[]> } - payment types.
   */
  public readonly paymentTypes$: Observable<
    SupportTierCurrency[]
  > = this.supportTiersService.getPaymentTypes$(this.service.supportTier$);

  typeChangeSubscription: Subscription;

  /**
   * Constructor
   * @param service
   * @param shop
   */
  constructor(
    public service: WireV2Service,
    public supportTiersService: SupportTiersService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.typeChangeSubscription = combineLatest(
      this.service.type$,
      this.supportTiers$,
      this.service.supportTier$
    )
      .pipe(debounceTime(100))
      .subscribe(([type, supportTiers, supportTier]) => {
        if (!supportTier.has_tokens && type === 'tokens')
          this.service.supportTier$.next(supportTiers[0]);
      });
  }

  ngOnDestroy() {
    this.typeChangeSubscription.unsubscribe();
  }

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
