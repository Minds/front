import { Directive, View, EventEmitter, ElementRef, Inject } from 'angular2/core';
import { Material as MaterialService } from "../services/ui";
import { ScrollFactory } from '../services/ux/scroll';

@Directive({
  selector: 'infinite-scroll',
  inputs: ['_distance: distance', 'on', '_inProgress: locked'],
  events: ['loadHandler: load']
})
@View({
  template: '<loading-icon>loading more..</loading-icon>',
  directives: []
})

export class InfiniteScroll{

  scroll = ScrollFactory.build();

  element : any;
  loadHandler: EventEmitter<boolean> = new EventEmitter(true);
  _distance : any;
  _inProgress : boolean = false;
  _content : any;
  _listener;

  constructor(_element: ElementRef) {
    this.element = _element.nativeElement;
    this.init();
  }

  init(){
    this._listener = this.scroll.listen((view) => {
      if(this.element.offsetTop - this.element.clientHeight - view.height <= view.top){
        this.loadHandler.next(true);
      }
    });
  }

  ngOnDestroy(){
    if(this._listener)
      this.scroll.unListen(this._listener);
  }

}
