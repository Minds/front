import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WireRewardsTiers, WireRewardsType } from '../../interfaces/wire.interfaces';
import { Session, SessionFactory } from '../../../../services/session';

@Component({
  selector: 'm-wire-console--rewards',
  templateUrl: 'wire-console-rewards.component.html'
})

export class WireConsoleRewardsComponent {
  @Input() type: WireRewardsType;
  @Input() channel;

  rewards: WireRewardsTiers = [];

  @Input('rewards') set _rewards(rewards: WireRewardsTiers) {
    this.rewards = rewards;

    if (!this.rewards) {
      this.rewards = [];
      this.addTier();
    }
  }

  @Output('rewardsChange') rewardsChangeEmitter: EventEmitter<WireRewardsTiers> = new EventEmitter<WireRewardsTiers>();

  editing: boolean = false;

  private session: Session;

  constructor() {
    this.session = SessionFactory.build();
  }

  addTier() {
    this.rewards.push({
      amount: '',
      description: ''
    });
    this.rewardsChangeEmitter.emit(this.rewards);
  }

  setAmount(index, value) {
    this.rewards[index].amount = value;
    this.rewardsChangeEmitter.emit(this.rewards);
  }

  setDescription(index, value) {
    this.rewards[index].description = value;
    this.rewardsChangeEmitter.emit(this.rewards);
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
}