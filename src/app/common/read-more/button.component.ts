import {
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { ReadMoreDirective } from './read-more.directive';
import { Router } from '@angular/router';

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
          <span
            (click)="onExpandClick()"
            i18n="@@COMMON__SEE_MORE__ACTION"
            class="m-readMoreButtonV2__text"
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

  // When set, forces see more to redirect.
  @Input() redirectUrl: string = '';

  // Don't expand on click
  @Input() clickDisabled: boolean = false;

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

  constructor(private cd: ChangeDetectorRef, private router: Router) {}

  expandIfShowingOnlyFadeout($event: MouseEvent) {
    if (this.clickDisabled === true || !this.showOnlyFadeout) {
      return;
    }
    if ($event) {
      $event.stopPropagation();
      $event.preventDefault();
    }
    if (this.showOnlyFadeout) {
      this.content.expand();
    }
  }

  /**
   * Callback executed when expand (see more / read more) is clicked.
   * @returns void
   */
  public onExpandClick(): void {
    if (this.clickDisabled === true) {
      return;
    }
    if (this.redirectUrl.length > 0) {
      this.cd.detach();
      this.router.navigate([this.redirectUrl]);
    }
    this.content.expand();
  }

  detectChanges() {
    setTimeout(() => {
      this.cd.markForCheck();
      this.cd.detectChanges();
    });
  }
}
