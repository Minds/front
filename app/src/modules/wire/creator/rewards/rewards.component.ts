import { Component, Input, Output, EventEmitter } from '@angular/core';

import { WireRewardsType, WireRewardsStruc, WireRewardsTiers } from '../../interfaces/wire.interfaces';

@Component({
  moduleId: module.id,
  selector: 'm-wire--creator-rewards',
  templateUrl: 'rewards.component.html'
})
export class WireCreatorRewardsComponent {

  @Input() rewards: WireRewardsStruc;
  @Input() type: WireRewardsType | null;
  @Input() amount: string | number;
  @Input() channel: any;
  @Input() sums: any;
  @Output() selectAmount: EventEmitter<any> = new EventEmitter(true);

  isRewardAboveThreshold(index: number): boolean {
    if (!this.rewards || !this.type || !this.calcAmount()) {
      return false;
    }

    return this.calcAmount() >= this.rewards.rewards[this.type][index].amount;
  }

  isBestReward(index: number): boolean {
    if (!this.rewards || !this.type || !this.calcAmount()) {
      return false;
    }

    const lastEligibleReward = this.rewards.rewards[this.type]
      .map((reward, index) => ({ ...reward, index }))
      .filter(reward => this.calcAmount() >= reward.amount)
      .pop();

    return lastEligibleReward ?
      index === lastEligibleReward.index :
      false;
  }

  calcAmount(): number {
    if (this.sums && this.sums[this.type]) {
      return parseFloat(this.sums[this.type]) + parseFloat(<string>this.amount);
    }

    return <number>this.amount;
  }

  selectReward(index: number): void {
    this.selectAmount.next(this.rewards.rewards[this.type][index].amount);
  }

}
