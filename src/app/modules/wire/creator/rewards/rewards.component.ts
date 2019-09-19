import { Component, Input, Output, EventEmitter } from '@angular/core';

import { FeaturesService } from '../../../../services/features.service';
import {
  WireRewardsType,
  WireRewardsStruc,
  WireRewardsTiers,
} from '../../interfaces/wire.interfaces';

@Component({
  selector: 'm-wireCreator__rewards',
  templateUrl: 'rewards.component.html',
})
export class WireCreatorRewardsComponent {
  rewards: Array<any> = [];
  @Input() amount: number = 1;
  currency: string = 'tokens';

  @Input() type: WireRewardsType | null;
  @Input() channel: any;
  @Input() sums: any;
  @Output() selectAmount: EventEmitter<any> = new EventEmitter(true);
  @Output() selectCurrency: EventEmitter<string> = new EventEmitter(true);
  @Output('selectReward') selectRewardEvt: EventEmitter<any> = new EventEmitter(
    true
  );

  constructor(private featuresService: FeaturesService) {}

  selectReward(reward): void {
    this.selectRewardEvt.next(reward);
    // this.selectAmount.next(reward.amount);
    //this.selectCurrency.next(reward.currency);
  }

  get selectedReward() {
    const methods = [{ method: 'tokens', currency: 'offchain' }];

    if (this.featuresService.has('wire-multi-currency')) {
      methods.push({ method: 'money', currency: 'usd' });
    }

    for (const method of methods) {
      const match = this.findReward();
      if (match) {
        //this.selectReward(match);
        return match;
        break;
      }
    }
    return null;
  }

  /**
   * Return a reward that closest matches our query
   * @param method
   */

  private findReward() {
    for (let r of this.rewards) {
      if (this.currency === r.currency && this.amount == r.amount) {
        return r;
      }
    }
    return null;
  }

  @Input('rewards') set _rewards(rewards) {
    this.rewards = [];

    if (!rewards || !rewards.rewards) {
      return;
    }

    const methodsMap = [{ method: 'tokens', currency: 'tokens' }];

    if (this.featuresService.has('wire-multi-currency')) {
      methodsMap.push({ method: 'money', currency: 'usd' });
    }

    for (const { method, currency } of methodsMap) {
      if (!rewards.rewards[method]) {
        continue;
      }
      for (const reward of rewards.rewards[method]) {
        this.rewards.push({
          amount: parseInt(reward.amount),
          description: reward.description,
          currency,
        });
      }
    }
  }

  @Input('currency') set _currency(currency: string) {
    switch (currency) {
      //case 'money':
      //currency = 'usd';
      //  break;
      case 'offchain':
      case 'onchain':
        currency = 'tokens';
        break;
    }
    this.currency = currency;
  }
}
