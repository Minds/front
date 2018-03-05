import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UniqueId } from '../../../helpers/unique-id.helper';

@Component({
  moduleId: module.id,
  selector: 'm-material--bound-switch',
  template: `
    <label class="mdl-switch mdl-js-switch mdl-js-ripple-effect" [for]="id" [attr.disabled]="disabled" [mdlSwitch] [toggled]="true" *ngIf="toggled" (click)="change(!toggled, $event)">
      <input type="checkbox" [id]="id" class="mdl-switch__input" [disabled]="disabled">
    </label>
    <label class="mdl-switch mdl-js-switch mdl-js-ripple-effect" [for]="id" [attr.disabled]="disabled" [mdlSwitch] [toggled]="false" *ngIf="!toggled" (click)="change(toggled, $event)">
      <input type="checkbox" [id]="id" class="mdl-switch__input" [disabled]="disabled">
    </label>
  `
})
export class MaterialBoundSwitchComponent {
  id: string;

  @Input() toggled: boolean = false;
  @Input() disabled: boolean = false;

  @Output('change') changeEmitter: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit() {
    this.id = UniqueId.generate();
  }

  change(newValue, $event) {
    this.changeEmitter.emit(newValue);

    if ($event) {
      $event.stopPropagation();
    }
  }
}
