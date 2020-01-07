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
import { ProService } from '../pro.service';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { WirePaymentsCreatorComponent } from '../../wire/creator/payments/payments.creator.component';
import { WirePaymentHandlersService } from '../../wire/wire-payment-handlers.service';
import {
  UpgradeOptionCurrency,
  UpgradeOptionInterval,
} from '../../upgrades/upgrade-options.component';
import currency from '../../../helpers/currency';

@Component({
  selector: 'm-pro--subscription',
  templateUrl: 'subscription.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProSubscriptionComponent implements OnInit {
  @Output() onEnable: EventEmitter<any> = new EventEmitter();

  @Output() onDisable: EventEmitter<any> = new EventEmitter();

  interval: UpgradeOptionInterval = 'yearly';

  currency: UpgradeOptionCurrency = 'usd';

  paramSubscription: Subscription;

  isLoggedIn: boolean = false;

  inProgress: boolean = false;

  active: boolean;

  criticalError: boolean = false;

  error: string = '';

  minds = window.Minds;

  constructor(
    protected service: ProService,
    public session: Session,
    protected overlayModal: OverlayModalService,
    protected wirePaymentHandlers: WirePaymentHandlersService,
    protected cd: ChangeDetectorRef,
    protected route: ActivatedRoute,
    protected router: Router
  ) {}

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
        `/pro?c=${this.currency}&i=${this.interval}`
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
          await this.wirePaymentHandlers.get('pro'),
          {
            interval: this.interval,
            currency: this.currency,
            amount: this.minds.upgrades.pro[this.interval][this.currency],
            onComplete: () => {
              this.active = true;
              this.minds.user.pro = true;
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
      this.minds.user.pro = false;
      this.error = (e && e.message) || 'Unknown error';
      this.inProgress = false;
    }

    this.detectChanges();
  }

  async disable() {
    if (!confirm('Click OK if you want to cancel your Pro subscription...')) {
      return;
    }

    this.inProgress = true;
    this.error = '';
    this.detectChanges();

    try {
      await this.service.disable();
      this.active = false;
      this.minds.user.pro = false;
      this.onDisable.emit(Date.now());
    } catch (e) {
      this.active = true;
      this.minds.user.pro = true;
      this.error = (e && e.message) || 'Unknown error';
    }

    this.inProgress = false;
    this.detectChanges();
  }

  get pricing() {
    if (this.interval === 'yearly') {
      return {
        amount: currency(
          this.minds.upgrades.pro.yearly[this.currency] / 12,
          this.currency
        ),
        offerFrom: currency(
          this.minds.upgrades.pro.monthly[this.currency],
          this.currency
        ),
      };
    } else if (this.interval === 'monthly') {
      return {
        amount: currency(
          this.minds.upgrades.pro.monthly[this.currency],
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
