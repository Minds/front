import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  OnDestroy,
} from '@angular/core';
import noOp from '../../../../../helpers/no-op';
import { SupportTier } from '../../../../wire/v2/support-tiers.service';
import { ChannelShopMembershipsEditService } from './edit.service';
import { ConfigsService } from '../../../../../common/services/configs.service';
import { Subscription } from 'rxjs';
import { WalletV2Service } from '../../../../wallet/components/wallet-v2.service';

/**
 * Modal that allows users to edit a membership tier
 */
@Component({
  selector: 'm-channelShopMemberships__edit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'edit.component.html',
  styleUrls: ['edit.component.ng.scss'],
  providers: [ChannelShopMembershipsEditService, WalletV2Service],
})
export class ChannelShopMembershipsEditComponent implements OnInit, OnDestroy {
  public readonly tokenExchangeRate: number;

  /**
   * Save intent
   */
  onSave: (any) => any = noOp;

  /**
   * Dismiss intent
   */
  onDismissIntent: () => void = noOp;

  canSaveSubscription: Subscription;
  canSave: boolean = false;

  /**
   * Constructor
   * @param service
   */
  constructor(
    public service: ChannelShopMembershipsEditService,
    private configs: ConfigsService
  ) {
    this.tokenExchangeRate = configs.get('token_exchange_rate') || 1.25;
  }

  /**
   * Modal options
   * @param onSave
   * @param onDismissIntent
   * @param {SupportTier} supportTier
   */
  setModalData({ onSave, onDismissIntent, supportTier }) {
    this.onSave = onSave || noOp;
    this.onDismissIntent = onDismissIntent || noOp;
    if (supportTier) {
      this.load(supportTier);
    }
  }

  ngOnInit(): void {
    this.canSaveSubscription = this.service.canSave$.subscribe(
      canSave => (this.canSave = canSave)
    );
  }

  ngOnDestroy(): void {
    this.canSaveSubscription.unsubscribe();
  }

  /**
   * Loads a Support Tier into the editor
   * @param supportTier
   */
  load(supportTier: SupportTier): void {
    this.service.reset();

    if (!supportTier) {
      return;
    }

    this.service.load(supportTier);
  }

  /**
   * Sets the USD amount subject based on a numeric value
   * @param amount
   */
  setUsd(amount: string) {
    amount = amount.trim();

    if (amount.slice(-1) === '.') {
      // If we're in the middle of writing a decimal value, don't process it
      return;
    }

    const numericAmount = parseFloat(amount.replace(/,/g, '') || '0');

    if (isNaN(numericAmount)) {
      return;
    }

    this.service.usd$.next(numericAmount);
  }

  /**
   * Saves a Support Tier
   */
  async save(): Promise<void> {
    if (!this.canSave) {
      return;
    }

    const supportTier = await this.service.save().toPromise();

    if (supportTier) {
      this.onSave(supportTier);
    }
  }
}
