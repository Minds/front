import { Component, Input } from '@angular/core';

/**
 * DEPRECATED
 *
 * Legacy dropdown component.
 *
 * TODO: replace all instances of this component with the newer 'm-dropdownMenu'
 */
@Component({
  selector: 'm-dropdown',
  template: `
    <ng-template #dropdownListContent>
      <ng-content select=".m-dropdown--list,.m-dropdown__list"></ng-content>
    </ng-template>

    <ng-container *ngIf="!expanded; else expandedView">
      <div class="m-dropdown">
        <div
          class="m-dropdown--label-container"
          [class.m-dropdown--label-active]="toggled"
          (click)="toggle()"
        >
          <ng-content select="label"></ng-content>
        </div>

        <div class="m-dropdown--list-container" [hidden]="!toggled">
          <ng-container *ngTemplateOutlet="dropdownListContent"></ng-container>
        </div>
      </div>

      <div class="minds-bg-overlay" *ngIf="toggled" (click)="toggle()"></div>
    </ng-container>
    <ng-template #expandedView>
      <div class="m-dropdown--expanded">
        <div class="m-dropdown--expanded-list-container">
          <ng-container *ngTemplateOutlet="dropdownListContent"></ng-container>
        </div>
      </div>
    </ng-template>
  `,
})
export class DropdownComponent {
  @Input() expanded: boolean = false;
  @Input() enabled: boolean = true;

  toggled = false;

  toggle() {
    if (this.enabled) {
      this.toggled = !this.toggled;
    }
  }

  close() {
    this.toggled = false;
  }
}
