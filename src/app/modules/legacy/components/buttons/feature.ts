import { Component } from '@angular/core';
import { Session } from '../../../../services/session';
import { Client } from '../../../../services/api';

@Component({
  selector: 'minds-button-feature',
  inputs: ['_object: object'],
  template: `
    <button
      class="m-btn m-btn--with-icon"
      [ngClass]="{ selected: isFeatured }"
      (click)="isFeatured ? feature() : (open = true)"
    >
      <i class="material-icons">star</i>
    </button>
    <m-modal [open]="open" (closed)="onModalClose($event)">
      <div class="m-button-feature-modal">
        <select [(ngModel)]="category">
          <option
            value="not-selected"
            i18n="@@MINDS__BUTTONS__FEATURE__CATEGORY_PLACEHOLDER"
            >-- SELECT A CATEGORY --</option
          >
          <option *ngFor="let category of categories" [value]="category.id">{{
            category.label
          }}</option>
        </select>

        <button
          class="mdl-button mdl-button--colored"
          (click)="feature()"
          i18n="@@M__ACTION__FEATURE"
        >
          Feature
        </button>
      </div>
    </m-modal>
  `,
})
export class FeatureButton {
  object;
  isFeatured: boolean = false;

  open: boolean = false;
  category: string = 'not-selected';
  categories: Array<any> = [];

  constructor(public session: Session, public client: Client) {}

  set _object(value: any) {
    if (!value) return;
    this.object = value;
    this.isFeatured = value.featured_id || value.featured === true;
  }

  feature() {
    var self = this;

    if (this.isFeatured) return this.unFeature();

    this.isFeatured = true;

    this.client
      .put('api/v1/admin/feature/' + this.object.guid + '/' + this.category, {})
      .then((response: any) => {
        this.open = false;
      })
      .catch(e => {
        this.isFeatured = false;
      });
  }

  unFeature() {
    var self = this;
    this.isFeatured = false;
    this.object.featured = false;
    this.client
      .delete('api/v1/admin/feature/' + this.object.guid, {})
      .then((response: any) => {
        this.open = false;
      })
      .catch(e => {
        this.isFeatured = true;
      });
  }

  onModalClose(e) {
    this.open = false;
  }
}
