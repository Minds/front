import { Component, Input, ElementRef } from '@angular/core';
import { ReadMoreDirective } from './read-more.directive';

@Component({
  selector: 'm-read-more--button',
  template: `
    <div class="m-read-more--button" *ngIf="content && content.expandable">
      <span class="mdl-color-text--blue-grey-500" (click)="content.expand()">read more</span>
    </div>
  `
})

export class ReadMoreButtonComponent {

  content: ReadMoreDirective;

}
