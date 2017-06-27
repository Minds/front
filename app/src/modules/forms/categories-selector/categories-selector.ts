import { Component, EventEmitter } from '@angular/core';

import { Client } from '../../../services/api';

@Component({
  moduleId: module.id,
  selector: 'minds-onboarding-categories-selector',
  outputs: [ 'done' ],
  templateUrl: 'categories-selector.html',
})

export class OnboardingCategoriesSelector {

  minds = window.Minds;

  categories : Array<any> = [];
  channels : Array<any> = [];

  inProgress : boolean = false;
  done : EventEmitter<any> = new EventEmitter();

	constructor(public client : Client){

	}

  ngOnInit(){
    this.initCategories();
  }

  initCategories(){
    delete window.Minds.categories.other;
    this.categories = Object.keys(window.Minds.categories).map(function(key) {
        return {
          id: key,
          label: window.Minds.categories[key],
          selected: false
        };
    });
  }

  findChannels(){
    this.inProgress = true;
    this.client.get('api/v1/categories/featured', {
        categories: this.categories
          .filter((category) => {
            return category.selected;
          })
          .map((category) => {
            return category.id;
          })
      })
      .then((response : any) => {
        this.inProgress = false;
        this.channels = response.entities.map((channel) => {
          channel.selected = true;
          return channel;
        });
      })
      .catch(() => {
        this.inProgress = false;
      })
  }

  subscribe(){
    this.client.post('api/v1/subscribe/batch', {
        guids: this.channels
          .filter((channel) => {
            return channel.selected;
          })
          .map((channel) => {
            return channel.guid
          })
      });
    this.done.next(true);
  }

}
