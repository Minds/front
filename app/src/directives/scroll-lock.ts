import { Directive, ElementRef, EventEmitter } from '@angular/core';

@Directive({
  selector: '[scrollLock]',
  inputs: [ 'strictScrollLock' ],
  outputs: [ 'overscroll' ],
  host: {
    '(mouseenter)': 'lock()',
    '(mouseleave)': 'unlock()'
  }
})
export class ScrollLock {
  private element: HTMLElement;
  private body: HTMLElement;

  strictScrollLock: boolean = false;
  overscroll: EventEmitter<any> = new EventEmitter();

  private wheelHandler;  
  constructor(private _element: ElementRef) {
    this.element = _element.nativeElement;
    this.wheelHandler = this._domWheelLock(this);
  }

  lock() {
    this.element.addEventListener('wheel', this.wheelHandler, true);
  }

  unlock() {
    this.element.removeEventListener('wheel', this.wheelHandler, true);
  }

  ngOnDestroy() {
    this.unlock();
  }

  private _domWheelLock(_this) {
    return function (event: WheelEvent) {
      let el: HTMLElement = <HTMLElement>(event.currentTarget);
      if (event.ctrlKey) { // Zooming
        return;
      }

      event.stopPropagation();

      if (!this.strictScrollLock && el.scrollHeight <= el.clientHeight) {
        return;
      }

      let ratio = el.clientHeight / window.innerHeight,
        delta = (<any>event).wheelDelta || (-1 * event.detail) || (-1 * event.deltaY),
        deltaY = event.deltaY * ratio;

      if (
        (delta > 0 && el.scrollTop + deltaY <= 0) ||
        (delta < 0 && el.scrollTop + deltaY >= el.scrollHeight - el.clientHeight)
      ) {
        event.preventDefault();

        _this.overscroll.emit({
          deltaY
        });

        if (deltaY) {
          el.scrollTop += deltaY;
        }
      }
    };
  }
}
