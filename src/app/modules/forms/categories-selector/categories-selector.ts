import { Component, EventEmitter } from '@angular/core';

import { Client } from '../../../services/api';

@Component({
  moduleId: module.id,
  selector: 'minds-onboarding-categories-selector',
  outputs: ['done'],
  templateUrl: 'categories-selector.html',
})

export class OnboardingCategoriesSelector {

  minds = window.Minds;

  categories: Array<any> = [];

  inProgress: boolean = false;
  done: EventEmitter<any> = new EventEmitter();

  constructor(public client: Client) {

  }

  ngOnInit() {
    this.initCategories();
  }

  initCategories() {
    delete window.Minds.categories.other;
    for (let category in window.Minds.categories) {
      this.categories.push({
        id: category,
        label: window.Minds.categories[category],
        'selected': false
      });
    }
  }

  saveCategories() {
    this.inProgress = true;
    const filteredCategories: any[] = this.categories.filter(category => category.selected).map(category => category.id);
    this.client.post('api/v1/settings', {
      categories: filteredCategories
    })
      .then((response: any) => {
        this.inProgress = false;
        this.done.next(true);
      })
      .catch(() => {
        this.inProgress = false;
      });
  }

}
