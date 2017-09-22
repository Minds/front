import { Directive, ElementRef, EventEmitter } from '@angular/core';

@Directive({
  selector: '[scrollLock]',
  inputs: ['strictScrollLock'],
  outputs: ['overscroll'],
  host: {
    '(mouseenter)': 'lock()',
    '(mouseleave)': 'unlock()'
  }
})
export class ScrollLock {

  strictScrollLock: boolean = false;
  overscroll: EventEmitter<any> = new EventEmitter();

  private element: HTMLElement;
  private body: HTMLElement;
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
        normalizedWheel = _this._normalizeWheel(event),
        deltaY = normalizedWheel.pixelY;

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

  // https://stackoverflow.com/a/30134826
  private _normalizeWheel(event) {
    const PIXEL_STEP = 10;
    const LINE_HEIGHT = 40;
    const PAGE_HEIGHT = 800;

    var sX = 0, sY = 0,       // spinX, spinY
      pX = 0, pY = 0;       // pixelX, pixelY

    // Legacy
    if ('detail' in event) { sY = event.detail; }
    if ('wheelDelta' in event) { sY = -event.wheelDelta / 120; }
    if ('wheelDeltaY' in event) { sY = -event.wheelDeltaY / 120; }
    if ('wheelDeltaX' in event) { sX = -event.wheelDeltaX / 120; }

    // side scrolling on FF with DOMMouseScroll
    if ('axis' in event && event.axis === event.HORIZONTAL_AXIS) {
      sX = sY;
      sY = 0;
    }

    pX = sX * PIXEL_STEP;
    pY = sY * PIXEL_STEP;

    if ('deltaY' in event) { pY = event.deltaY; }
    if ('deltaX' in event) { pX = event.deltaX; }

    if ((pX || pY) && event.deltaMode) {
      if (event.deltaMode === 1) {
        pX *= LINE_HEIGHT;
        pY *= LINE_HEIGHT;
      } else {
        pX *= PAGE_HEIGHT;
        pY *= PAGE_HEIGHT;
      }
    }

    // Fall-back if spin cannot be determined
    if (pX && !sX) { sX = (pX < 1) ? -1 : 1; }
    if (pY && !sY) { sY = (pY < 1) ? -1 : 1; }

    return {
      spinX: sX,
      spinY: sY,
      pixelX: pX,
      pixelY: pY
    };
  }
}
