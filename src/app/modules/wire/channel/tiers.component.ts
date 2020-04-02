import { Component, Input, EventEmitter, Output } from '@angular/core';

import { Session } from '../../../services/session';
import { Client } from '../../../services/api';
import {
  WireRewardsType,
  WireRewardsStruc,
} from '../interfaces/wire.interfaces';
import { WireTypeLabels } from '../wire';

@Component({
  selector: 'm-wire__subscriptionTiers',
  templateUrl: 'tiers.component.html',
})
export class WireSubscriptionTiersComponent {
  @Input() user;
  @Input() editing;
  @Input() saveEventListener = new EventEmitter();
  @Output() isSaving = new EventEmitter();
  @Output() isSaved = new EventEmitter();

  rewards = {
    description: '',
    rewards: {
      points: [],
      money: [],
      tokens: [],
    },
  };

  constructor(public session: Session, private client: Client) {}

  ngOnInit() {
    if (this.user && this.user.wire_rewards) {
      this.rewards = this.user.wire_rewards;
    }
    this.saveEventListener.subscribe(() => this.save());
  }

  async save() {
    this.rewards.rewards.points = this._cleanAndSortRewards(
      this.rewards.rewards.points
    );
    this.rewards.rewards.money = this._cleanAndSortRewards(
      this.rewards.rewards.money
    );
    this.rewards.rewards.tokens = this._cleanAndSortRewards(
      this.rewards.rewards.tokens
    );

    try {
      await this.client.post('api/v1/wire/rewards', {
        rewards: this.rewards,
      });
      this.session.getLoggedInUser().wire_rewards = this.rewards;
      this.isSaved.next(true);
    } catch (e) {
      alert((e && e.message) || 'Server error');
    } finally {
      this.isSaving.next(false);
    }
  }

  // Internal

  private _cleanAndSortRewards(rewards: any[]) {
    if (!rewards) {
      return [];
    }

    return rewards
      .filter(reward => reward.amount || `${reward.description}`.trim())
      .map(reward => ({
        ...reward,
        amount: Math.abs(Math.floor(reward.amount || 0)),
      }))
      .sort((a, b) => (a.amount > b.amount ? 1 : -1));
  }
}
