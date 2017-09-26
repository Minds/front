import { Directive, EventEmitter, ElementRef, Input, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[inlineAutoGrow]'
})
export class InlineAutoGrow {

  _element: HTMLInputElement;
  timeout: any;

  @HostBinding('style.boxSizing') boxSizing: string = 'content-box';

  constructor(element: ElementRef) {
    this._element = element.nativeElement;

    setTimeout(() => {
      this.grow();
    });
  }

  @HostListener('keydown') onKeyDown() {
    this.grow();
  }

  @HostListener('paste') onPaste() {
    this.grow();
  }

  @HostListener('change') onChange() {
    this.grow();
  }

  @HostListener('ngModelChange') onNgModelChange() {
    this.grow();
  }

  @Input('ngModel') set _model(value: any) {
    this.grow();
  }

  grow() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = void 0;
    }

    this.timeout = setTimeout(() => {
      this._element.style.width = '0';
      this._element.style.width = this._element.scrollWidth + 'px';
    });
  }
}
