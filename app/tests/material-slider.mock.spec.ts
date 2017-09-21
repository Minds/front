import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[mdlSlider]',
  inputs: [ 'mdlSlider', 'ngModel', 'value' ]
})

export class MaterialSliderMock {
  private element: any;
  mdlSlider: any;
  value: string = '0';

  constructor(_element: ElementRef) {
    this.element = _element.nativeElement;
  }


  set ngModel(value) {
    if (value == Number.POSITIVE_INFINITY || value == Number.NEGATIVE_INFINITY) {
      return;
    }

    this.value = value;
  }
}
