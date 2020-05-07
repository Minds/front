import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
} from '@angular/core';
import { WireService } from '../../wire.service';
import { WireV2Service } from '../wire-v2.service';
import { WalletV2Service } from '../../../wallet/v2/wallet-v2.service';
import { SupportTiersService } from '../support-tiers.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'm-wireCreator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'wire-creator.component.html',
  providers: [WireService, WireV2Service, WalletV2Service, SupportTiersService],
})
export class WireCreatorComponent implements OnDestroy {
  /**
   * Sets the entity that will receive the payment
   * @param object
   */
  @Input('object') set data(object) {
    this.service.setEntity(object);
  }

  /**
   * Completion intent
   */
  onComplete: (any) => any = () => {};

  /**
   * Dismiss intent
   */
  onDismissIntent: () => void = () => {};

  /**
   * Owner subject subscription
   */
  protected ownerSubscription: Subscription;

  /**
   * Modal options
   *
   * @param onComplete
   * @param onDismissIntent
   * @param defaults
   */
  set opts({ onComplete, onDismissIntent, default: defaultValues }) {
    this.onComplete = onComplete || (() => {});
    this.onDismissIntent = onDismissIntent || (() => {});

    if (defaultValues) {
      switch (defaultValues.type) {
        case 'tokens':
          this.service.setType('tokens');
          this.service.setTokenType('offchain');
          break;

        case 'money':
          this.service.setType('usd');
          break;
      }

      this.service.setAmount(parseFloat(defaultValues.min || '0'));
      this.service.setRecurring(true);
    }
  }

  /**
   * Constructor
   * @param service
   * @param supportTiers
   */
  constructor(
    public service: WireV2Service,
    public supportTiers: SupportTiersService
  ) {
    this.ownerSubscription = this.service.owner$.subscribe(owner =>
      this.supportTiers.setEntityGuid(owner && owner.guid)
    );
  }

  /**
   * Component destroy
   */
  ngOnDestroy(): void {
    if (this.ownerSubscription) {
      this.ownerSubscription.unsubscribe();
    }
  }

  /**
   * Submit button handler
   */
  async onSubmit() {
    this.onComplete(await this.service.submit());
  }
}
