import { Directive, EventEmitter, ElementRef } from '@angular/core';

@Directive({
  selector: '[autoGrow]',
  inputs: ['autoGrow', '_model: ngModel'],
  host: {
    '(keydown)': 'grow()',
    '(paste)': 'grow()',
    '(change)': 'grow()',
    '(ngModelChange)': 'grow()'
  }
})


export class AutoGrow {
  _element: any;
  timeout: any;
  autoGrow: any;

  constructor(element: ElementRef) {
    this._element = element.nativeElement;
    setTimeout(() => {
      this.grow();
    });
  }

  set _model(value: any) {
    this.grow();
  }

  grow() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    this.timeout = setTimeout(() => {
      this._element.style.overflow = 'hidden';
      this._element.style.maxHeight = 'none';
      this._element.style.height = 'auto';
      this._element.style.height = this._element.scrollHeight + 'px';
      this._element.style.overflow = '';
      this._element.style.maxHeight = '';
    });
  }
}
