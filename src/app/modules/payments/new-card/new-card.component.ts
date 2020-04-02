import {
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Client } from '../../../services/api';
import { WalletService } from '../../../services/wallet';
import { Storage } from '../../../services/storage';
import { Session } from '../../../services/session';

@Component({
  selector: 'm-payments__newCard',
  templateUrl: 'new-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentsNewCard {
  minds = (<any>window).Minds;
  intentKey: string = '';
  intentId: string = '';
  @ViewChild('iframe', { static: false }) iframe: ElementRef;
  @Output() completed: EventEmitter<void> = new EventEmitter();

  _opts: any;
  set opts(opts: any) {
    this._opts = opts;
  }

  constructor(
    public session: Session,
    public client: Client,
    public cd: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
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
    this._opts.onCompleted();
    this.detectChanges();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
