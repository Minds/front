import { Component, OnInit } from '@angular/core';
import { WireRewardsStruc, WireRewardsTiers, WireRewardsType } from '../../interfaces/wire.interfaces';
import { Client } from '../../../../services/api/client';

@Component({
  moduleId: module.id,
  selector: 'm-wire-console--rewards--container',
  templateUrl: 'rewards.component.html'
})

export class WireConsoleRewardsComponent  {
  minds: Minds;
  rewards: WireRewardsStruc;
  rewardsSaved: boolean = false;

  constructor(private client: Client) {
    this.minds = window.Minds;
    this.rewards = this.minds.user.wire_rewards;
  }

  onRewardsChange(rewards: WireRewardsTiers, type: WireRewardsType) {
    this.rewards.rewards[type] = rewards;
    this.rewardsSaved = false;
  }

  saveRewards() {
    this.rewards.rewards.points = this._cleanAndSortRewards(this.rewards.rewards.points);
    this.rewards.rewards.money = this._cleanAndSortRewards(this.rewards.rewards.money);
    this.rewards.rewards.tokens = this._cleanAndSortRewards(this.rewards.rewards.tokens);

    this.client.post('api/v1/wire/rewards', {
      rewards: this.rewards
    })
      .then(() => {
        this.rewardsSaved = true;
      })
      .catch(e => {
        alert((e && e.message) || 'Server error');
      });
  }

  private _cleanAndSortRewards(rewards: any[]) {
    if (!rewards) {
      return [];
    }

    return rewards
      .filter(reward => reward.amount || `${reward.description}`.trim())
      .map(reward => ({ ...reward, amount: Math.abs(Math.floor(reward.amount || 0)) }))
      .sort((a, b) => a.amount > b.amount ? 1 : -1);
  }
}