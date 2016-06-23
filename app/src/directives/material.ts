import { Directive, ViewContainerRef, Type, Inject } from '@angular/core';
import { Material as MaterialService } from "../services/ui";

import { MaterialTextfield } from './material/text-field';
import { MaterialUpload } from './material/upload';

@Directive({
  selector: '[mdl]',
  properties: ['mdl']
})

export class Material{
  constructor(viewContainer: ViewContainerRef) {
    //MaterialService.rebuild();
    MaterialService.updateElement(viewContainer.element.nativeElement);
  }
}

export const MDL_DIRECTIVES: Type[] = [Material, MaterialTextfield, MaterialUpload];
