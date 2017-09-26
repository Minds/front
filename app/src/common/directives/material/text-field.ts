import { Directive, ElementRef, Inject } from '@angular/core';
import { Material as MaterialService } from '../../../services/ui';

@Directive({
  selector: '[mdlTextfield]',
  inputs: ['mdlTextfield']
})

export class MaterialTextfield {

  mdlTextfield: any;
  private element: any;

  constructor(_element: ElementRef) {
    this.element = _element.nativeElement;
  }

  ngAfterViewInit() {
    MaterialService.updateElement(this.element);
  }
}
