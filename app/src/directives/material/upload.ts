import { Directive, ViewContainerRef, Inject } from '@angular/core';
import { Material as MaterialService } from "../../services/ui";

@Directive({
  selector: '[mdlUpload]',
  inputs: ['mdlUpload', 'progress']
})

export class MaterialUpload{

  element : any;

  constructor(viewContainer: ViewContainerRef) {
    this.element = viewContainer.element.nativeElement;
    MaterialService.updateElement(viewContainer.element.nativeElement);


  }

  set progress(value : number){
    this.element.MaterialProgress.setProgress(value);
  }
}
