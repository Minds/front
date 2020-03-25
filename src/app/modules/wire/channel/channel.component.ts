import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';

import { Session } from '../../../services/session';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { WireCreatorComponent } from '../creator/creator.component';
import { Client } from '../../../services/api';
import {
  WireRewardsType,
  WireRewardsStruc,
} from '../interfaces/wire.interfaces';
import { WireTypeLabels } from '../wire';
import { SignupModalService } from '../../modals/signup/service';

@Component({
  moduleId: module.id,
  selector: 'm-wire-channel',
  templateUrl: 'channel.component.html',
})
export class WireChannelComponent implements OnInit {
  rewards: WireRewardsStruc;

  @Input() channelV2Design: boolean = false;

  @Input('rewards') set _rewards(rewards: WireRewardsStruc) {
    if (rewards) {
      this.rewards = rewards;
    } else {
      this.reset();
    }
  }

  @Output('rewardsChange')
  rewardsChangeEmitter: EventEmitter<WireRewardsStruc> = new EventEmitter<
    WireRewardsStruc
  >();

  @Input() channel: any;

  @Input() editing: boolean;

  display: WireRewardsType;
  typeLabels = WireTypeLabels;

  constructor(
    public session: Session,
    private overlayModal: OverlayModalService,
    private client: Client,
    private signupModal: SignupModalService
  ) {}

  ngOnInit() {
    if (!this.rewards) {
      this.reset();
    }

    this.setDefaultDisplay();
  }

  // TODO: Smart default display, based on current user
  setDefaultDisplay() {
    this.display = 'points';

    if (this.shouldShow('money')) {
      this.display = 'money';
    } else if (this.shouldShow('tokens')) {
      this.display = 'tokens';
    }
  }

  toggleEditing() {
    this.editing = !this.editing;

    if (!this.editing) {
      this.save();
    }
  }

  reset() {
    this.rewards = {
      description: '',
      rewards: {
        points: [],
        money: [],
        tokens: [],
      },
    };
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
      this.rewardsChangeEmitter.emit(this.rewards);
      this.session.getLoggedInUser().wire_rewards = this.rewards;
    } catch (e) {
      this.editing = true;
      alert((e && e.message) || 'Server error');
    }
  }

  sendWire() {
    if (!this.session.isLoggedIn()) {
      this.signupModal.open();

      return;
    }

    const creator = this.overlayModal.create(
      WireCreatorComponent,
      this.channel
    );
    creator.present();
  }

  isOwner() {
    return (
      this.session.getLoggedInUser() &&
      this.session.getLoggedInUser().guid === this.channel.guid
    );
  }

  shouldShow(type?: WireRewardsType) {
    const isOwner = this.isOwner();

    if (!type) {
      return (
        isOwner ||
        this.rewards.description ||
        (this.rewards.rewards.points && this.rewards.rewards.points.length) ||
        (this.rewards.rewards.money && this.rewards.rewards.money.length) ||
        (this.rewards.rewards.tokens && this.rewards.rewards.tokens.length)
      );
    }

    const canShow =
      type === 'points' ||
      (type === 'money' && this.channel.merchant) ||
      (type === 'tokens' && this.channel.eth_wallet);

    return (
      canShow &&
      (isOwner ||
        (this.rewards.rewards[type] && this.rewards.rewards[type].length))
    );
  }

  shouldShowTitle() {
    return this.channelV2Design
      ? this.session.getLoggedInUser().guid === this.channel.guid
      : true;
  }

  getCurrentTypeLabel() {
    return this.typeLabels.find(typeLabel => typeLabel.type === this.display);
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
