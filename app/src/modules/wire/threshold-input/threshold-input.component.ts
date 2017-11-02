import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, OnInit } from '@angular/core';

import { WireThresholdStruc, WireRewardsType } from '../interfaces/wire.interfaces';
import { WireTypeLabels } from '../wire';
import { Session, SessionFactory } from '../../../services/session';

@Component({
  selector: 'm-wire-threshold-input',
  templateUrl: 'threshold-input.component.html'
})
export class WireThresholdInputComponent implements OnInit {
  threshold: WireThresholdStruc;

  @Input('threshold') set _threshold(threshold: WireThresholdStruc) {
    this.threshold = threshold;
    this.enabled = !!threshold;

    if (!this.threshold) {
      let currency: WireRewardsType = 'points';
      if (this.session.getLoggedInUser() && this.session.getLoggedInUser().merchant)
        currency = 'money';
      this.threshold = {
        type: currency,
        min: 0
      };
    }
  }
  @Input('disabled') disabled: boolean = false;

  @Output('thresholdChange') thresholdChangeEmitter: EventEmitter<WireThresholdStruc> = new EventEmitter<WireThresholdStruc>();
  @Output('validThreshold') validThresholdEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input('enabled') enabled: boolean = false;
  @Output('enabledChange') enabledChangeEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  typeLabels = WireTypeLabels;
  session: Session = SessionFactory.build();

  @ViewChild('minAmountInput') minAmountInput: ElementRef;

  ngOnInit() {
    this.validThresholdEmitter.emit(this.validate());
  }

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

    this.threshold.min = !isNaN(cleanValue) ? cleanValue: 0;
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

  // Internal

  private _emitChange() {
    this.thresholdChangeEmitter.emit(this.enabled ? this.threshold: null);
    this.enabledChangeEmitter.emit(this.enabled);
    this.validThresholdEmitter.emit(this.validate());
  }
}
