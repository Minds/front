import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[mdlSwitch]',
  inputs: ['mdlSwitch', 'toggled']
})

export class MaterialSwitchMock {

  mdlSwitch: any;
  private element: any;

  constructor(_element: ElementRef) {
    this.element = _element.nativeElement;
  }

  set toggled(value: boolean) {
    if (value)
      this.element.classList.add('is-checked');
  }

}
