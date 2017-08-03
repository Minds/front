import { Component, Input, Output, EventEmitter } from '@angular/core';
import { WireRewardsType, WireRewardsTiers } from "../../interfaces/wire.interfaces";

@Component({
  moduleId: module.id,
  selector: 'm-wire-channel-table',
  templateUrl: 'table.component.html'
})
export class WireChannelTableComponent {
  @Input() type: WireRewardsType;

  rewards: WireRewardsTiers = [];

  @Input('rewards') set _rewards(rewards: WireRewardsTiers) {
    this.rewards = rewards;

    if (!this.rewards) {
      this.rewards = [];
    }
  }

  @Output('rewardsChange') rewardsChangeEmitter: EventEmitter<WireRewardsTiers> = new EventEmitter<WireRewardsTiers>();

  editing: boolean = false;
  @Input('editing') set _editing(value: boolean) {
    this.editing = value;

    if (this.editing && !this.rewards.length) {
      this.addTier();
    } else if (!this.editing) {
      this.rewardsChangeEmitter.emit(this.rewards);
    }
  }

  addTier() {
    this.rewards.push({
      amount: '',
      description: ''
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
        placeholder = 'Points';
        break;

      case 'money':
        placeholder = '$ USD';
        break;
    }

    return placeholder;
  }
}
