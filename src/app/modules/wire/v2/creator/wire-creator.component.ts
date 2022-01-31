import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { WireService } from '../../wire.service';
import { WireV2Service } from '../wire-v2.service';
import { WalletV2Service } from '../../../wallet/components/wallet-v2.service';
import { SupportTiersService } from '../support-tiers.service';
import { Subscription, combineLatest } from 'rxjs';
import { ConfigsService } from '../../../../common/services/configs.service';
import { Session } from '../../../../services/session';
import { AuthModalService } from '../../../auth/modal/auth-modal.service';
@Component({
  selector: 'm-wireCreator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'wire-creator.component.html',
  styleUrls: ['wire-creator.component.ng.scss'],
  providers: [WireService, WireV2Service, WalletV2Service, SupportTiersService],
})
export class WireCreatorComponent implements OnDestroy {
  /**
   * Prices for yearly/monthly upgrades to pro/plus
   */
  readonly upgrades: any;

  isLoggedIn: boolean = this.session.isLoggedIn();

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
   * Support Tier Subscription
   */
  protected supportTierSubscription: Subscription;

  /**
   * Constructor
   * @param service
   * @param supportTiers
   */
  constructor(
    public service: WireV2Service,
    public supportTiers: SupportTiersService,
    private configs: ConfigsService,
    private cd: ChangeDetectorRef,
    private session: Session,
    private authModal: AuthModalService
  ) {
    this.ownerSubscription = this.service.owner$.subscribe(owner =>
      this.supportTiers.setEntityGuid(owner && owner.guid)
    );
    this.upgrades = configs.get('upgrades');
  }

  /**
   * Modal options
   *
   * @param onComplete
   * @param onDismissIntent
   * @param defaults
   */
  setModalData({
    onComplete,
    onDismissIntent,
    default: defaultValues,
    entity,
    supportTier,
  }: {
    onComplete;
    onDismissIntent;
    default?;
    entity;
    supportTier?;
  }) {
    this.onComplete = onComplete || (() => {});
    this.onDismissIntent = onDismissIntent || (() => {});

    if (entity) {
      this.service.setEntity(entity);
    }

    if (supportTier) {
      this.service.supportTier$.next(supportTier);
      this.service.setType('usd');
      this.service.setRecurring(true);
      this.service.setAmount(supportTier.usd);
    }

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

      this.service.setRecurring(true);
      if (defaultValues.upgradeType) {
        this.service.setIsUpgrade(true);
        this.service.setUpgradeType(defaultValues.upgradeType);
        this.service.setUpgradeInterval(
          defaultValues.upgradeInterval || 'yearly'
        );
        return;
      }
      this.service.setAmount(parseFloat(defaultValues.min || '0'));
    }
  }

  ngOnInit() {
    if (!this.session.isLoggedIn()) {
      this.authModal
        .open()
        .then(async () => {
          this.isLoggedIn = this.session.isLoggedIn();
          this.service.wallet.getTokenAccounts();
          await this.configs.loadFromRemote();
          // We do this to prompt the trial to display
          this.service.upgradeType$.next(this.service.upgradeType$.value);
          this.service.upgrades = this.configs.get('upgrades');
          this.cd.markForCheck();
          this.cd.detectChanges();
        })
        .catch(() => {
          this.onDismissIntent();
        });
    }
    this.supportTierSubscription = combineLatest(
      this.service.supportTier$,
      this.service.type$
    ).subscribe(([supportTier, type]) => {
      if (supportTier) this.service.setAmount(supportTier[type]);
    });
  }

  /**
   * Component destroy
   */
  ngOnDestroy(): void {
    if (this.ownerSubscription) {
      this.ownerSubscription.unsubscribe();
    }
    this.supportTierSubscription.unsubscribe();
  }

  /**
   * Submit button handler
   */
  async onSubmit() {
    this.onComplete(await this.service.submit());
  }
}
