import { Component, View } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';

import { SessionFactory } from '../../services/session';
import { Client } from '../../services/api';

@Component({
  selector: 'minds-button-feature',
  inputs: ['_object: object'],
  host: {
    '(click)': 'feature()'
  }
})
@View({
  template: `
    <button class="" [ngClass]="{'selected': isFeatured }">
      <i class="material-icons">star</i>
    </button>
  `,
  directives: [CORE_DIRECTIVES]
})

export class FeatureButton {

  object;
  session = SessionFactory.build();
  isFeatured : boolean = false;

  constructor(public client : Client) {
  }

  set _object(value : any){
    if(!value)
      return;
    this.object = value;
    this.isFeatured = value.featured_id || (value.featured == true);
  }

  feature(){
    var self = this;

    if (this.isFeatured)
      return this.unFeature();

    this.isFeatured = true;

    this.client.put('api/v1/admin/feature/' + this.object.guid, {})
      .then((response : any) => {

      })
      .catch((e) => {
        this.isFeatured = false;
      });
  }

  unFeature(){
    var self = this;
    this.isFeatured = false;
    this.object.featured = false;
    this.client.delete('api/v1/admin/feature/' + this.object.guid, {})
      .then((response : any) => {

      })
      .catch((e) => {
        this.isFeatured = true;
      });
  }

}
