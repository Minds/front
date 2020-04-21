import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  WireRewardsTiers,
  WireRewardsType,
} from '../../../interfaces/wire.interfaces';
import { Session } from '../../../../../services/session';
import { WireModalService } from '../../../wire-modal.service';

@Component({
  moduleId: module.id,
  selector: 'm-wireV2__channelTable',
  templateUrl: 'table.component.html',
})
export class WireV2ChannelTableComponent {
  @Input() type: WireRewardsType;
  @Input() channel;

  rewards: WireRewardsTiers = [];

  @Input('rewards') set _rewards(rewards: WireRewardsTiers) {
    this.rewards = rewards;

    if (!this.rewards) {
      this.rewards = [];
    }
  }

  @Output('rewardsChange') rewardsChangeEmitter: EventEmitter<
    WireRewardsTiers
  > = new EventEmitter<WireRewardsTiers>();

  editing: boolean = false;
  @Input('editing') set _editing(value: boolean) {
    this.editing = value;

    if (this.editing && !this.rewards.length) {
      this.addTier();
    } else if (!this.editing) {
      this.rewardsChangeEmitter.emit(this.rewards);
    }
  }
  @Output('editingChange') editingChange: EventEmitter<
    boolean
  > = new EventEmitter<boolean>();

  constructor(public session: Session, private wireModal: WireModalService) {}

  addTier() {
    this.editing = true;
    this.editingChange.next(true);
    this.rewards.push({
      amount: '',
      description: '',
    });
  }

  setAmount(index, value) {
    this.rewards[index].amount = value;
  }

  setDescription(index, value) {
    this.rewards[index].description = value;
  }

  getAmountPlaceholder() {
    let placeholder;

    switch (this.type) {
      case 'points':
        placeholder = '1,000';
        break;

      case 'money':
        placeholder = '5';
        break;

      case 'tokens':
        placeholder = '1';
        break;
    }

    return placeholder;
  }

  async openWireModal(reward) {
    const user = this.session.getLoggedInUser();
    if (user.guid !== this.channel.guid) {
      await this.wireModal
        .present(this.channel, {
          default: {
            min: reward.amount,
            type: this.type,
          },
          disableThresholdCheck: true,
        })
        .toPromise();
    }
  }
}
