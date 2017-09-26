import { AfterViewInit, Directive, ViewContainerRef } from '@angular/core';
import { Material as MaterialService } from '../../../services/ui';

@Directive({
  selector: '[mdlSlider]',
  inputs: ['mdlSlider', 'ngModel', 'value']
})

export class MaterialSlider implements AfterViewInit {

  element: any;
  mdlSlider: any;
  value: string = '0';

  constructor(viewContainer: ViewContainerRef) {
    this.element = viewContainer.element.nativeElement;

    MaterialService.updateElement(this.element);
  }

  ngAfterViewInit() {
    this.element.MaterialSlider.change(this.value);
  }

  set ngModel(value) {
    if (value === Number.POSITIVE_INFINITY || value === Number.NEGATIVE_INFINITY) {
      return;
    }

    this.element.MaterialSlider.change(value);
    this.value = value;
  }

}
