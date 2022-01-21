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
import { NewCardModalComponent } from '../new-card-modal/new-card-modal.component';
import { Subscription } from 'rxjs';
import { ModalService } from '../../../services/ux/modal.service';

@Component({
  selector: 'm-payments__selectCard',
  templateUrl: 'select-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentsSelectCard {
  minds = (<any>window).Minds;
  @Output() selected: EventEmitter<string> = new EventEmitter();
  selectedSubscription: Subscription;
  inProgress = false;
  paymentMethodId: string = '';
  paymentMethods = [];

  constructor(
    public session: Session,
    public client: Client,
    public cd: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.loadCards();

    this.selectedSubscription = this.selected.subscribe(id => {
      if (id === 'new') {
        this.onAddNewCard();
      }
    });
  }

  ngOnDestroy() {
    this.selectedSubscription.unsubscribe();
  }

  async loadCards() {
    this.inProgress = true;
    const { paymentmethods } = <any>(
      await this.client.get('api/v2/payments/stripe/paymentmethods')
    );
    this.paymentMethods = paymentmethods;
    if (paymentmethods && paymentmethods.length) {
      this.paymentMethodId = paymentmethods[0].id;
      this.selected.next(this.paymentMethodId);
    }
    this.inProgress = false;
    this.detectChanges();
  }

  async onAddNewCard(): Promise<void> {
    const modal = this.modalService.present(NewCardModalComponent, {
      data: {
        onComplete: () => {
          this.loadCards();
          modal.close();
        },
      },
    });
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
