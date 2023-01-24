import {
  Component,
  OnInit,
  Input,
  AfterViewChecked,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'm-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
})
export class DynamicFormComponent
  implements OnInit, AfterViewChecked, OnChanges {
  @Input() fields;
  form: UntypedFormGroup;
  fieldDefinitions;

  constructor() {}

  ngOnInit() {
    this.updateFields();
  }

  private updateFields() {
    this.fieldDefinitions = Object.keys(this.fields).map(prop => {
      return Object.assign({}, { key: prop }, this.fields[prop]);
    });

    const formGroup = {};
    for (const prop of Object.keys(this.fields)) {
      formGroup[prop] = new UntypedFormControl(
        this.fields[prop].value || '',
        this.mapValidators(this.fields[prop].validation)
      );
    }

    this.form = new UntypedFormGroup(formGroup);
  }

  ngOnChanges(changes: any) {
    const fields: any = changes.fields;
    console.log(fields);
    this.updateFields();
  }

  ngAfterViewChecked() {
    window.componentHandler.upgradeDom();
  }

  private mapValidators(validators) {
    const formValidators = [];

    if (validators) {
      for (const validation of Object.keys(validators)) {
        switch (validation) {
          case 'required':
            formValidators.push(Validators.required);
            break;
          case 'min':
            formValidators.push(Validators.min(validators[validation]));
            break;
          case 'max':
            formValidators.push(Validators.max(validators[validation]));
            break;
        }
      }
    }

    return formValidators;
  }

  getValues() {
    const values = Object.assign({}, this.form.value);
    // map values if necessary
    for (const prop of Object.keys(this.fields)) {
      if (this.fields[prop].map && values[prop]) {
        values[prop] = this.fields[prop].map(values[prop]);
      }
    }
    return values;
  }
}
