import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WireRewardsTiers } from '../../../interfaces/wire.interfaces';
import { Session } from '../../../../../services/session';

@Component({
  moduleId: module.id,
  selector: 'm-wire-console--rewards--inputs',
  templateUrl: 'wire-console-rewards-inputs.component.html'
})

export class WireConsoleRewardsInputsComponent {
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

  constructor(private session: Session) { }

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
}
