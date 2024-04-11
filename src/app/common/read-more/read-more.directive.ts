import {
  Directive,
  ElementRef,
  ContentChild,
  ChangeDetectorRef,
  Input,
} from '@angular/core';
import { ReadMoreButtonComponent } from './button.component';

@Directive({
  selector: '[m-read-more]',
})
export class ReadMoreDirective {
  _element: any;
  realHeight: any;
  expandable: boolean = false;
  @ContentChild(ReadMoreButtonComponent) button;
  _maxHeightAllowed: number;

  constructor(
    private element: ElementRef,
    private cd: ChangeDetectorRef
  ) {
    this._element = element.nativeElement;
  }

  @Input() set maxHeightAllowed(value: number) {
    if (this._maxHeightAllowed !== value) {
      this._maxHeightAllowed = value;
      this._element.style.maxHeight = null;
      this.hideIfNeeded();
    }
  }

  ngAfterViewInit() {
    if (!this._maxHeightAllowed) {
      this._maxHeightAllowed = 320;
      this.hideIfNeeded();
    }
  }

  hideIfNeeded(): void {
    setTimeout(() => {
      this.realHeight = this._element.clientHeight;

      if (this.button && !this.button.content) {
        this.button.content = this;
      }

      if (this.realHeight > this._maxHeightAllowed) {
        this._element.style.maxHeight = this._maxHeightAllowed + 'px';
        this._element.style.position = 'relative';
        this._element.style.overflow = 'hidden';
        setTimeout(() => {
          this.expandable = true;
          this.detectChanges();
        }, 0);
      } else {
        this.expand();
      }
    }, 0);
  }

  expand() {
    this._element.style.maxHeight = 'none';
    this._element.style.overflow = 'visible';
    this.expandable = false;
    this.detectChanges();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
    if (this.button) {
      this.button.detectChanges();
    }
  }
}
