import { Directive, ElementRef, Inject } from '@angular/core';
import { Material as MaterialService } from "../../services/ui";

@Directive({
  selector: '[mdlUpload]',
  inputs: ['mdlUpload', 'progress']
})

export class MaterialUpload{

  private element: any;

  constructor(_element: ElementRef) {
    this.element = _element.nativeElement;
  }

  ngAfterViewInit() {
    MaterialService.updateElement(this.element);
  }

  set progress(value : number){
    this.element.MaterialProgress.setProgress(value);
  }
}
