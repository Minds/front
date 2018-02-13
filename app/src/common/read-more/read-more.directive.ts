import { Directive, ElementRef, ContentChild, ChangeDetectorRef } from '@angular/core';
import { ReadMoreButtonComponent } from './button.component';

@Directive({
  selector: '[m-read-more]',
})
export class ReadMoreDirective {

  _element: any;
  realHeight: any;
  maxHeightAllowed: number = 320;
  expandable: boolean = false;
  @ContentChild(ReadMoreButtonComponent) button;

  constructor(private element: ElementRef, private cd: ChangeDetectorRef) {
    this._element = element.nativeElement;
  }

  ngAfterViewInit() {
    this.realHeight = this._element.clientHeight;

    if (this.button && !this.button.content)
      this.button.content = this;

    if (this.realHeight > this.maxHeightAllowed) {
      this._element.style.maxHeight = this.maxHeightAllowed + 'px';
      this._element.style.position = 'relative';
      setTimeout(() => {
        this.expandable = true;
        this.detectChanges();
      }, 1);
    }
  }

  expand() {
    this._element.style.maxHeight = 'none';
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
