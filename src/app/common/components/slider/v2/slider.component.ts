import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Slider component for use in forms.
 */
@Component({
  selector: 'm-formInput__sliderV2',
  styleUrls: ['./slider.component.ng.scss'],
  template: `
    <input
      type="range"
      [min]="min"
      [max]="max"
      [step]="step"
      [ngModel]="value"
      (ngModelChange)="updateValue($event)"
    />
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputSliderV2Component),
      multi: true,
    },
  ],
})
export class FormInputSliderV2Component implements ControlValueAccessor {
  // max value selectable with slider.
  @Input() public max: number = 100;

  // min value selectable with slider.
  @Input() public min: number = 0;

  // gap between steps on slider.
  @Input() public step: number = 1;

  // value held by slider.
  public value: number = 0;

  /**
   * Update slider value and propagate the change.
   * @param { number } value.
   * @returns { void }
   */
  public updateValue(value: number): void {
    this.value = value;
    this.propagateChange(this.value);
  }

  /**
   * Propagate change function.
   * @param { any } _
   * @returns { any }
   */
  public propagateChange = (_: any) => {};

  /**
   * Register on touched function.
   * @param { any } fn
   * @returns { any }
   */
  public registerOnTouched(fn: any): void {}

  /**
   * Write value to local value variable.
   * @param { any } value - value to write.
   * @returns { void }
   */
  public writeValue(value: any): void {
    this.value = value;
  }

  /**
   * Register on change function.
   * @param { any } fn set propagate change function.
   * @returns { void }
   */
  public registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
}
