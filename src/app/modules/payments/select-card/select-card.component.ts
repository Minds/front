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
  selector: 'm-payments__selectCard',
  templateUrl: 'select-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentsSelectCard {
  minds = (<any>window).Minds;
  @Output() selected: EventEmitter<string> = new EventEmitter();
  paymentMethodId: string = '';
  paymentMethods = [];

  constructor(
    public session: Session,
    public client: Client,
    public cd: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.loadCards();
  }

  async loadCards() {
    const { paymentmethods } = <any>(
      await this.client.get('api/v2/payments/stripe/paymentmethods')
    );
    this.paymentMethods = paymentmethods;
    this.paymentMethodId = paymentmethods[0].id;
    this.selected.next(this.paymentMethodId);
    this.detectChanges();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
