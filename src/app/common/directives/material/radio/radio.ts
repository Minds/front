import { Directive, ElementRef } from '@angular/core';
import { Material as MaterialService } from '../../../../services/ui';

@Directive({
  selector: '[mdlRadio]',
  inputs: ['mdlRadio', 'checked', 'mdlRadioValue']
})
export class MaterialRadio {
  mdlRadio:any;
  private element: any;
  mdlRadioValue:any;

  constructor(_element: ElementRef) {
    this.element = _element.nativeElement;
  }

  set checked(value: any) {
    MaterialService.updateElement(this.element);

    if (value == this.mdlRadioValue) {
      this.element.classList.add('is-checked');
    } else {
      this.element.classList.remove('is-checked');
    }
  }
}
