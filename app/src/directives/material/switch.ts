import { Directive, ElementRef, Inject } from '@angular/core';
import { Material as MaterialService } from "../../services/ui";

@Directive({
  selector: '[mdlSwitch]',
  inputs: ['mdlSwitch'] 
})

export class MaterialSwitch{
  private element: any;

  constructor(_element: ElementRef) {
    this.element = _element.nativeElement;
  }

  ngAfterViewInit() {
    MaterialService.updateElement(this.element);
    //let switch = new (<any>window).MaterialSwitch(this.element);
        //switch.checkToggleState();
      //this.element.classList.add('is-checked');
  }
}
