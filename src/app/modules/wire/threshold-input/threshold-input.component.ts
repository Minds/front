import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, OnInit } from '@angular/core';

import { WireThresholdStruc, WireRewardsType } from '../interfaces/wire.interfaces';
import { WireTypeLabels } from '../wire';
import { Session } from '../../../services/session';

@Component({
  selector: 'm-wire-threshold-input',
  templateUrl: 'threshold-input.component.html'
})
export class WireThresholdInputComponent implements OnInit {
  threshold: WireThresholdStruc;

  @Input('threshold') set _threshold(threshold: WireThresholdStruc) {
    this.threshold = threshold;

    if (!this.threshold) {
      this.threshold = {
        type: 'tokens',
        min: 0
      };
    }
  }

  @Input('disabled') disabled: boolean = false;

  @Output('thresholdChange') thresholdChangeEmitter: EventEmitter<WireThresholdStruc> = new EventEmitter<WireThresholdStruc>();
  @Output('validThreshold') validThresholdEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  //REMOVE SOON.. this doesn't do anything
  @Input('enabled') legacyEnabled: boolean = false;
  @Output('enabledChange') enabledChangeEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  typeLabels = WireTypeLabels;

  @ViewChild('minAmountInput') minAmountInput: ElementRef;

  constructor(public session: Session) { }

  ngOnInit() {
    this.validThresholdEmitter.emit(this.validate());
  }

  get enabled() {
    return this.threshold.min > 0;
  }

  get rewards() {
    const user = this.session.getLoggedInUser();
    if (!user)
      return [];
    if (user.wire_rewards && user.wire_rewards.rewards && user.wire_rewards.rewards.tokens)
      return <{ amount: number, description: string}[]>user.wire_rewards.rewards.tokens;
    return [];
  }

  setType(type: WireRewardsType) {
    this.threshold.type = type;
    this._emitChange();

    this.focusInput();
  }

  setMinAmount(value: string) {
    let cleanValue = parseFloat(value.replace(/,/g, '.'));

    if (cleanValue) {
      // allow 3 decimals only
      cleanValue = Math.round(cleanValue * 1000) / 1000;
    } else {
      cleanValue = 0;
    }

    this.threshold.min = cleanValue;
    this._emitChange();
  }

  validate(): boolean {
    if (!this.enabled || this.disabled) {
      return true;
    }

    return !!(this.threshold.type && (this.threshold.min > 0));
  }

  focusInput() {
    setTimeout(() => {
      if (this.minAmountInput.nativeElement) {
        this.minAmountInput.nativeElement.focus();
      }
    }, 0);
  }

  selectTier(tier) {
    this.threshold.min = <number> parseInt(tier.amount);
    this._emitChange();
  }

  // Internal

  private _emitChange() {
    this.thresholdChangeEmitter.emit(this.enabled ? this.threshold: null);
    this.enabledChangeEmitter.emit(this.enabled);
    this.validThresholdEmitter.emit(this.validate());
  }
}
