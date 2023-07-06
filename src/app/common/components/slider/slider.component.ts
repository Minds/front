import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  UntypedFormBuilder,
} from '@angular/forms';

export const FORM_INPUT_SLIDER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FormInputSliderComponent),
  multi: true,
};
@Component({
  selector: 'm-formInput__slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.ng.scss'],
  providers: [FORM_INPUT_SLIDER_VALUE_ACCESSOR],
})
export class FormInputSliderComponent implements ControlValueAccessor {
  @Input() id: string;
  @Input() title: string;
  @Input() min: number = 0;
  @Input() max: number = 100;
  @Input() minLabel: string;
  @Input() maxLabel: string;
  @Input() startValue: number;
  @Input() step: string; // size of each increment
  @Input() disabled: boolean = false;

  @ViewChild('input', { static: true }) input: ElementRef;

  value: number;

  updateValue(value: number) {
    this.value = value;
    this.propagateChange(this.value);
  }

  propagateChange = (_: any) => {};

  constructor(private fb: UntypedFormBuilder) {
    if (this.startValue) {
      this.value = this.startValue;
    } else {
      this.value = this.calculateStartValue();
    }
  }

  /**
   * Calculates the starting value if one wasn't provided.
   * This will almost always be the midpoint between min & max.
   * (except when max is below min)
   */
  calculateStartValue(): number {
    return this.max < this.min
      ? this.min
      : this.min + (this.max - this.min) / 2;
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {}
}
