import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'm-dropdown',
  template: `
    <div class="m-dropdown">
      <div class="m-dropdown--label-container" [class.m-dropdown--label-active]="toggled" (click)="toggle()">
        <ng-content select="label"></ng-content>
      </div>
      <div class="m-dropdown--list-container" [hidden]="!toggled">
        <ng-content select=".m-dropdown--list" ></ng-content>
      </div>
    </div>

    <div class="minds-bg-overlay" *ngIf="toggled" (click)="toggle()"></div>
  `,
})

export class DropdownComponent {

  toggled = false;

  toggle() {
    this.toggled = !this.toggled;
  }

}
