import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[scrollLock]',
  inputs: [ 'strictScrollLock' ],
  host: {
    '(mouseenter)': 'lock()',
    '(mouseleave)': 'unlock()'
  }
})
export class ScrollLock {
  private element: HTMLElement;
  private body: HTMLElement;

  strictScrollLock: boolean = false;

  constructor(private _element: ElementRef) {
    this.element = _element.nativeElement;
  }

  lock() {
    this.element.addEventListener('wheel', this._domWheelLock, true);
  }

  unlock() {
    this.element.removeEventListener('wheel', this._domWheelLock, true);
  }

  ngOnDestroy() {
    this.unlock();
  }

  private _domWheelLock(event: WheelEvent) {
    return (() => { // Bind to this
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

        if (deltaY) {
          el.scrollTop += deltaY;
        }
      }
    })()
  }
}