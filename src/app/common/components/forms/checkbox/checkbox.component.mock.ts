import { Component, Input } from '@angular/core';
import { DefaultValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Mock form input checkbox component.
 */
@Component({
  selector: 'm-formInput__checkbox',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: MockFormInputCheckboxComponent,
      multi: true,
    },
  ],
  template: '',
})
export class MockFormInputCheckboxComponent extends DefaultValueAccessor {
  @Input() customId: string;
  @Input() disabled: boolean = false;
  @Input() ignoreClick: boolean = false;
}
