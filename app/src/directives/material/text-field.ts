import { Directive, ElementRef, Inject } from 'angular2/core';
import { Material as MaterialService } from "../../services/ui";

@Directive({
  selector: '[mdlTextfield]',
  inputs: ['mdlTextfield'],
  host: {
    "(change)": 'change()'
  }
})

export class MaterialTextfield{

  element : any;

  constructor(_element : ElementRef) {
    this.element = _element.nativeElement;

    MaterialService.updateElement(this.element);

  }

  change(){
  }

}
