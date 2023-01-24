import {
  Component,
  ElementRef,
  forwardRef,
  Input,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  UntypedFormBuilder,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

export const FORM_INPUT_CHECKBOX_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FormInputCheckboxComponent),
  multi: true,
};

@Component({
  selector: 'm-formInput__checkbox',
  templateUrl: 'checkbox.component.html',
  styleUrls: ['./checkbox.component.ng.scss'],
  providers: [FORM_INPUT_CHECKBOX_VALUE_ACCESSOR],
})
export class FormInputCheckboxComponent implements ControlValueAccessor {
  readonly id: string;
  value: boolean = false;

  @Input() disabled: boolean = false;

  @ViewChild('input', { static: true }) input: ElementRef;

  updateValue(value: boolean) {
    this.value = value;
    this.propagateChange(this.value);
  }

  propagateChange = (_: any) => {};

  constructor(private fb: UntypedFormBuilder) {
    this.id =
      `checkbox` +
      Math.random()
        .toString(36)
        .substring(2); // Confirm duplicates not possible?
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {}
}
