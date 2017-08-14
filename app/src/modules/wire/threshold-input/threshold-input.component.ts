import { Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';

import { WireThresholdStruc, WireRewardsType } from "../interfaces/wire.interfaces";
import { WireTypeLabels } from "../wire";
import { Session, SessionFactory } from "../../../services/session";

@Component({
  selector: 'm-wire-threshold-input',
  templateUrl: 'threshold-input.component.html'
})
export class WireThresholdInputComponent {
  threshold: WireThresholdStruc;

  @Input('threshold') set _threshold(threshold: WireThresholdStruc) {
    this.threshold = threshold;
    this.enabled = !!threshold;

    if (!this.threshold) {
      let currency:WireRewardsType = 'points';
      if (this.session.getLoggedInUser() && this.session.getLoggedInUser().merchant)
        currency = 'money';
      this.threshold = {
        type: currency,
        min: 0
      };
    }
  }

  @Output('thresholdChange') thresholdChangeEmitter: EventEmitter<WireThresholdStruc> = new EventEmitter<WireThresholdStruc>();

  enabled: boolean = false;

  typeLabels = WireTypeLabels;
  session: Session = SessionFactory.build();

  @ViewChild('minAmountInput') minAmountInput: ElementRef;

  toggle() {
    this.enabled = !this.enabled;

    if (this.enabled) {
      this.focusInput();
    }

    this._emitChange();
  }

  setType(type: WireRewardsType) {
    this.threshold.type = type;
    this._emitChange();

    this.focusInput();
  }

  setMinAmount(value: string) {
    const cleanValue = Math.floor(parseFloat(value.replace(/,/g, '')));

    this.threshold.min = !isNaN(cleanValue) ? cleanValue : 0;
    this._emitChange();
  }

  focusInput() {
    setTimeout(() => {
      if (this.minAmountInput.nativeElement) {
        this.minAmountInput.nativeElement.focus();
      };
    }, 0);
  }

  // Internal

  private _emitChange() {
    this.thresholdChangeEmitter.emit(this.enabled ? this.threshold : null);
  }
}
