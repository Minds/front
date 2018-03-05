import { Directive, EventEmitter, ViewContainerRef, Inject } from '@angular/core';


@Directive({
  selector: '[svgHack]',
  inputs: ['svgHack', 'height', 'width', 'viewBox']
})

export class GraphSVG {

  element: any;
  svgHack: any;

  constructor( @Inject(ViewContainerRef) viewContainer: ViewContainerRef) {
    this.element = viewContainer.element.nativeElement;
  }

  set height(value: any) {
    this.element.setAttribute('height', value);
  }

  set width(value: any) {
    this.element.setAttribute('width', value);
  }

  set viewBox(value: any) {
    this.element.setAttribute('viewBox', value);
  }

}
