import {
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Client } from '../../../services/api';
import { WalletService } from '../../../services/wallet';
import { Storage } from '../../../services/storage';
import { Session } from '../../../services/session';
import { ConfigsService } from '../../../common/services/configs.service';
import { isPlatformBrowser } from '@angular/common';
import { ExperimentsService } from '../../experiments/experiments.service';

/**
 * Form that uses a Stripe iframe.
 * Allows uers to add a new credit/debit card
 * to use with Minds Pay.
 *
 * See it in the Minds Pay modal.
 */
@Component({
  selector: 'm-payments__newCard',
  templateUrl: 'new-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./new-card.component.ng.scss'],
})
export class PaymentsNewCard {
  intentKey: string = '';
  intentId: string = '';
  @ViewChild('iframe') iframe: ElementRef;
  @Output() completed: EventEmitter<void> = new EventEmitter();
  _opts: any;

  /**
   * Feature flag, set on ngOnInit.
   */
  v2: boolean;

  constructor(
    public session: Session,
    public client: Client,
    public cd: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private configs: ConfigsService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private experimentsService: ExperimentsService
  ) {}

  setModalData(opts: { onCompleted: () => void }) {
    this._opts = opts;
  }

  ngOnInit() {
    this.v2 = this.experimentsService.hasVariation(
      'front-5785-stripe-checkout',
      true
    );
    if (this.v2) {
      if (isPlatformBrowser(this.platformId)) {
        this.goToCheckout();
      }
    } else {
      // V1
      window.addEventListener(
        'message',
        msg => {
          if (msg.data === 'completed-saved-card') {
            this.saveCard();
          }
        },
        false
      );
      this.setupIntent();
    }
  }

  /**
   * Will open stripe checkout in a new window and poll for closed event
   */
  goToCheckout(): void {
    const windowRef = window.open(
      this.configs.get('site_url') + 'api/v3/payments/stripe/checkout/setup',
      '_blank'
    );
    const timer = setInterval(() => {
      if (windowRef.closed) {
        clearInterval(timer);

        this.completed.next();
        this._opts?.onCompleted?.();
        this.detectChanges();
      }
    }, 500);
  }

  async setupIntent() {
    const { intent } = <any>(
      await this.client.put('api/v2/payments/stripe/intents/setup')
    );
    this.intentKey = intent.client_secret;
    this.intentId = intent.id;
    this.detectChanges();
  }

  get url() {
    const url =
      'https://checkout.minds.com/stripe?intent_key=' + this.intentKey;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  async saveCard() {
    const { success } = <any>await this.client.post(
      'api/v2/payments/stripe/paymentmethods/apply',
      {
        intent_id: this.intentId,
      }
    );
    this.intentKey = '';
    this.completed.next();
    this._opts?.onCompleted?.();
    this.detectChanges();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
