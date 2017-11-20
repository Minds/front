import { Component, Input, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ReadMoreDirective } from './read-more.directive';

@Component({
  selector: 'm-read-more--button',
  template: `
    <div class="m-read-more--button" *ngIf="content && content.expandable">
      <span class="mdl-color-text--blue-grey-500" (click)="content.expand()" i18n="@@COMMON__READ_MORE__ACTION">Read more</span>
    </div>
  `
})

export class ReadMoreButtonComponent {

  content: ReadMoreDirective;

  constructor(private cd: ChangeDetectorRef) {

  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

}
