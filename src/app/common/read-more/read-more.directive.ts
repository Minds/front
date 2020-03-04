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
  @ContentChild(ReadMoreButtonComponent, { static: false }) button;
  @Input() maxHeightAllowed: number;

  constructor(private element: ElementRef, private cd: ChangeDetectorRef) {
    this._element = element.nativeElement;
  }

  ngAfterViewInit() {
    if (!this.maxHeightAllowed) {
      this.maxHeightAllowed = 320;
    }

    setTimeout(() => {
      this.realHeight = this._element.clientHeight;
      if (this.button && !this.button.content) {
        this.button.content = this;
      }

      if (this.realHeight > this.maxHeightAllowed) {
        this._element.style.maxHeight = this.maxHeightAllowed + 'px';
        this._element.style.position = 'relative';
        this._element.style.overflow = 'hidden';
        setTimeout(() => {
          this.expandable = true;
          this.detectChanges();
        }, 1);
      }
    }, 1);
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
