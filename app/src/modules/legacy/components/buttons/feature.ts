import { Component } from '@angular/core';
import { SessionFactory } from '../../../../services/session';
import { Client } from '../../../../services/api';

@Component({
  selector: 'minds-button-feature',
  inputs: ['_object: object'],
  template: `
    <button class="" [ngClass]="{'selected': isFeatured }" (click)="isFeatured ? feature() : (open = true)">
      <i class="material-icons">star</i>
    </button>
    <m-modal [open]="open" (closed)="onModalClose($event)">
      <div class="m-button-feature-modal">
        <select [(ngModel)]="category">
          <option value="not-selected">-- SELECT A CATEGORY --</option>
          <option *ngFor="let category of categories" [value]="category.id">{{category.label}}</option>
        </select>

        <button class="mdl-button mdl-button--colored" (click)="feature()">Feature</button>
      </div>
    </m-modal>
  `
})

export class FeatureButton {

  object;
  session = SessionFactory.build();
  isFeatured: boolean = false;

  open: boolean = false;
  category: string = 'not-selected';
  categories: Array<any> = [];

  constructor(public client: Client) {
  }

  ngOnInit() {
    this.initCategories();
  }

  initCategories() {
    this.categories = Object.keys(window.Minds.categories).map(function (key) {
      return {
        id: key,
        label: window.Minds.categories[key]
      };
    });
  }

  set _object(value: any) {
    if (!value)
      return;
    this.object = value;
    this.isFeatured = value.featured_id || (value.featured === true);
  }

  feature() {
    var self = this;

    if (this.isFeatured)
      return this.unFeature();

    this.isFeatured = true;

    this.client.put('api/v1/admin/feature/' + this.object.guid + '/' + this.category, {})
      .then((response: any) => {
        this.open = false;
      })
      .catch((e) => {
        this.isFeatured = false;
      });
  }

  unFeature() {
    var self = this;
    this.isFeatured = false;
    this.object.featured = false;
    this.client.delete('api/v1/admin/feature/' + this.object.guid, {})
      .then((response: any) => {
        this.open = false;
      })
      .catch((e) => {
        this.isFeatured = true;
      });
  }

  onModalClose(e) {
    this.open = false;
  }

}
