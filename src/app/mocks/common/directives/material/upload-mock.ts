import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[mdlUpload]',
  inputs: ['mdlUpload', 'progress']
})

export class MaterialUploadMock {
  constructor(_element: ElementRef) {
  }

  ngAfterViewInit() {
  }

  set progress(value: number) {

  }

}
