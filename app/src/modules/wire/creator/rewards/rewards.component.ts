import { Component, Input } from "@angular/core";

import { WireRewardsType, WireRewardsStruc, WireRewardsTiers } from "../../interfaces/wire.interfaces";

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

  isRewardAboveThreshold(index: number): boolean {
    if (!this.rewards || !this.type || !this.amount) {
      return false;
    }

    return this.amount >= this.rewards.rewards[this.type][index].amount;
  }

  isBestReward(index: number): boolean {
    if (!this.rewards || !this.type || !this.amount) {
      return false;
    }

    const lastEligibleReward = this.rewards.rewards[this.type]
      .map((reward, index) => ({ ...reward, index }))
      .filter(reward => this.amount >= reward.amount)
      .pop();

    return lastEligibleReward ?
      index === lastEligibleReward.index :
      false;
  }
}
