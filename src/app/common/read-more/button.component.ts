import {
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { ReadMoreDirective } from './read-more.directive';

@Component({
  selector: 'm-read-more--button',
  template: `
    <ng-container *ngIf="wrapperClass; else versionedTemplate">
      <div *ngIf="content && content.expandable" [ngClass]="wrapperClass">
        <span class="m-readMoreButton__trigger" (click)="content.expand()"
          ><ng-content></ng-content
        ></span>
      </div>
    </ng-container>

    <ng-template #versionedTemplate>
      <ng-container *ngIf="v2; else v1El">
        <div
          class="m-read-more--button m-readMoreButton--v2"
          *ngIf="content && content.expandable"
          [class.showOnlyFadeout]="showOnlyFadeout"
          (click)="expandIfShowingOnlyFadeout()"
        >
          <span (click)="content.expand()" i18n="@@COMMON__SEE_MORE__ACTION"
            ><ng-container>See More</ng-container></span
          >
        </div>
      </ng-container>

      <ng-template #v1El>
        <div class="m-read-more--button" *ngIf="content && content.expandable">
          <span
            class="mdl-color-text--blue-grey-500"
            (click)="content.expand()"
            i18n="@@COMMON__READ_MORE__ACTION"
            >Read more</span
          >
        </div>
      </ng-template>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReadMoreButtonComponent {
  @Input() v2 = false;

  // Don't show the "see more" text
  @Input() showOnlyFadeout: boolean = false;

  // Wrapper class, same type as ngClass
  @Input() wrapperClass:
    | string
    | string[]
    | Set<string>
    | {
        [klass: string]: any;
      };

  content: ReadMoreDirective;

  constructor(private cd: ChangeDetectorRef) {}

  expandIfShowingOnlyFadeout($event: MouseEvent) {
    if (!this.showOnlyFadeout) {
      return;
    }
    $event.stopPropagation();
    $event.preventDefault();

    this.content.expand();
  }

  detectChanges() {
    setTimeout(() => {
      this.cd.markForCheck();
      this.cd.detectChanges();
    });
  }
}
