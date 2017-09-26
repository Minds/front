import { Directive, EventEmitter, ViewContainerRef, Inject } from '@angular/core';


@Directive({
  selector: '[points]',
  inputs: ['_points: points']
})

export class GraphPoints {

  element: any;

  constructor( @Inject(ViewContainerRef) viewContainer: ViewContainerRef) {
    this.element = viewContainer.element.nativeElement;
  }

  set _points(value: any) {
    this.element.setAttribute('points', value);
  }

}
