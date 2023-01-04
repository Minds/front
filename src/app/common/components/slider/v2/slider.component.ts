import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Slider component for use in forms.
 */
@Component({
  selector: 'm-formInput__sliderV2',
  styleUrls: ['./slider.component.ng.scss'],
  template: `
    <span [style.left]="valueLabelLeftOffset">{{ displayFormat(value) }}</span>
    <input
      type="range"
      [min]="minVal"
      [max]="maxVal"
      [step]="step"
      [ngModel]="sliderValue"
      (ngModelChange)="onSliderValueChange($event)"
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

  // Custom steps
  @Input() public steps = [];

  @Input() public displayFormat: (val: number) => string = val => String(val);

  // value held by slider.
  public sliderValue: number = 0;

  /**
   * Default format label value
   */
  formatLabel = val => {
    return val;
  };

  /**
   * Update slider value and propagate the change.
   * @param { number } value.
   * @returns { void }
   */
  public onSliderValueChange(value: number): void {
    this.sliderValue = value;
    this.propagateChange(this.hasCustomSteps ? this.steps[value] : value);
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
    this.sliderValue = this.hasCustomSteps ? this.steps.indexOf(value) : value;
  }

  /**
   * Register on change function.
   * @param { any } fn set propagate change function.
   * @returns { void }
   */
  public registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  /**
   * True/False if using custom steps
   */
  get hasCustomSteps(): boolean {
    return this.steps?.length > 0;
  }

  /**
   * The actual value we will return the calling component
   */
  get value(): number {
    return this.hasCustomSteps
      ? this.steps[this.sliderValue]
      : this.sliderValue;
  }

  /**
   * The max value to use in the slider.
   * If we use custom steps, we use the size of the array
   */
  get maxVal(): number {
    return this.hasCustomSteps ? this.steps.length - 1 : this.max;
  }

  /**
   * The min value to use in the slider.
   * If we use custom steps, we set this to be always 0
   */
  get minVal() {
    return this.hasCustomSteps ? 0 : this.min;
  }

  /**
   * Calculates the left position of the floating label
   */
  get valueLabelLeftOffset(): string {
    const pct =
      ((this.sliderValue - this.minVal) * 100) / (this.maxVal - this.minVal);
    return `calc(${pct}% - (${8 + pct * 0.2}px))`;
  }
}
