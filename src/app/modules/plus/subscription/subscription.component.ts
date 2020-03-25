import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Session } from '../../../services/session';
import { PlusService } from '../plus.service';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { WirePaymentsCreatorComponent } from '../../wire/creator/payments/payments.creator.component';
import { WirePaymentHandlersService } from '../../wire/wire-payment-handlers.service';
import {
  UpgradeOptionCurrency,
  UpgradeOptionInterval,
} from '../../upgrades/upgrade-options.component';
import currency from '../../../helpers/currency';
import { Location } from '@angular/common';
import { ConfigsService } from '../../../common/services/configs.service';

@Component({
  selector: 'm-plus--subscription',
  templateUrl: 'subscription.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlusSubscriptionComponent implements OnInit {
  readonly upgrades; // TODO: add type
  @Output() onEnable: EventEmitter<any> = new EventEmitter();

  @Output() onDisable: EventEmitter<any> = new EventEmitter();

  interval: UpgradeOptionInterval = 'yearly';

  currency: UpgradeOptionCurrency = 'usd';

  paramSubscription: Subscription;

  isLoggedIn: boolean = false;

  inProgress: boolean = false;

  active: boolean;

  canBeCancelled: boolean;

  criticalError: boolean = false;

  error: string = '';

  constructor(
    protected service: PlusService,
    protected session: Session,
    protected overlayModal: OverlayModalService,
    protected wirePaymentHandlers: WirePaymentHandlersService,
    protected cd: ChangeDetectorRef,
    protected route: ActivatedRoute,
    protected router: Router,
    configs: ConfigsService
  ) {
    this.upgrades = configs.get('upgrades');
  }

  ngOnInit() {
    this.isLoggedIn = this.session.isLoggedIn();

    if (this.isLoggedIn) {
      this.load();
    }

    this.paramSubscription = this.route.queryParams.subscribe(
      (params: Params) => {
        this.currency = params.c || 'usd';
        this.interval = params.i || 'yearly';

        if (params.c || params.i) {
          this.enable();
        }
      }
    );
  }

  async load() {
    this.inProgress = true;
    this.error = '';
    this.detectChanges();

    try {
      this.active = await this.service.isActive();
      this.canBeCancelled = await this.service.canBeCancelled();
    } catch (e) {
      this.criticalError = true;
      this.error = (e && e.message) || 'Unknown error';
    }

    this.inProgress = false;
    this.detectChanges();
  }

  async enable() {
    if (!this.session.isLoggedIn()) {
      localStorage.setItem(
        'redirect',
        `/plus?c=${this.currency}&i=${this.interval}`
      );
      this.router.navigate(['/login']);
      return;
    }

    this.inProgress = true;
    this.error = '';
    this.detectChanges();

    try {
      this.overlayModal
        .create(
          WirePaymentsCreatorComponent,
          await this.wirePaymentHandlers.get('plus'),
          {
            interval: this.interval,
            currency: this.currency,
            amount: this.upgrades.plus[this.interval][this.currency],
            onComplete: () => {
              this.active = true;
              this.session.getLoggedInUser().plus = true;
              this.onEnable.emit(Date.now());
              this.inProgress = false;
              this.detectChanges();
            },
          }
        )
        .onDidDismiss(() => {
          this.inProgress = false;
          this.detectChanges();
        })
        .present();
    } catch (e) {
      this.active = false;
      this.session.getLoggedInUser().plus = false;
      this.error = (e && e.message) || 'Unknown error';
      this.inProgress = false;
    }

    this.detectChanges();
  }

  async disable() {
    if (!confirm('Click OK if you want to cancel your Plus subscription...')) {
      return;
    }

    this.inProgress = true;
    this.error = '';
    this.detectChanges();

    try {
      await this.service.disable();
      this.active = false;
      this.session.getLoggedInUser().plus = false;
      this.onDisable.emit(Date.now());
    } catch (e) {
      this.active = true;
      this.session.getLoggedInUser().plus = true;
      this.error = (e && e.message) || 'Unknown error';
    }

    this.inProgress = false;
    this.detectChanges();
  }

  get pricing() {
    if (this.interval === 'yearly') {
      return {
        amount: currency(
          this.upgrades.plus.yearly[this.currency] / 12,
          this.currency
        ),
        offerFrom: currency(
          this.upgrades.plus.monthly[this.currency],
          this.currency
        ),
      };
    } else if (this.interval === 'monthly') {
      return {
        amount: currency(
          this.upgrades.plus.monthly[this.currency],
          this.currency
        ),
        offerFrom: null,
      };
    }
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.paramSubscription.unsubscribe();
  }
}
