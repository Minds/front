import { Directive, ElementRef, Inject, Input } from '@angular/core';
import { Material as MaterialService } from '../../../services/ui';

@Directive({
  selector: '[mdlSwitch]',
  inputs: ['mdlSwitch', 'toggled']
})

export class MaterialSwitch {

  mdlSwitch: any;
  private element: any;
  private _toggled: boolean = false;

  constructor(_element: ElementRef) {
    this.element = _element.nativeElement;
  }

  ngAfterViewInit() {
    //MaterialService.updateElement(this.element);
    //let switch = new (<any>window).MaterialSwitch(this.element);
    //switch.checkToggleState();
    //if(this._toggled)
    //this.element.classList.add('is-checked');
  }

  set toggled(value: boolean) {
    MaterialService.updateElement(this.element);
    if (value)
      this.element.classList.add('is-checked');
  }

}
