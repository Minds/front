import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Client } from '../../../services/api/client';

@Component({
  selector: 'm-safe-toggle',
  template: `
    <div class="m-safe-toggle" (click)="onRatingToggle($event)">
      <label>
        <i class="material-icons" [class.m-safe-toggle--active]="entity.rating === 1">ac_unit</i>
      </label>
    </div>`
})

export class SafeToggleComponent {
  
  @Input('entity') entity: any;
  @Output('entityChange') entityChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(public client: Client)
  {
  }

  onRatingToggle(event) {
    this.entity.rating = !this.entity.rating || this.entity.rating === 1 ? 2: 1;

    this.client.post(`api/v1/admin/rating/${this.entity.guid}/${this.entity.rating}`)
      .then(() => {
        this.entityChange.emit(this.entity);
      })
      .catch((e) => {
        this.entity.rating = this.entity.rating === 1 ? 2: 1;
      });

    event.preventDefault();
    event.stopPropagation();
  }

}