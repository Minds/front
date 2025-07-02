import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[mdlTextfield]',
  inputs: ['mdlTextfield'],
  standalone: false,
})
export class MaterialTextfieldMock {
  mdlTextfield: any;

  constructor(_element: ElementRef) {}
}
