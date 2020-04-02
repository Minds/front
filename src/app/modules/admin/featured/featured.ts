import { Component } from '@angular/core';

import { Client } from '../../../services/api';

@Component({
  selector: 'minds-admin-featured',
  templateUrl: 'featured.html',
})
export class AdminFeatured {
  categories: any[] | null;
  category: string = '';
  featured: any[] = [];

  inProgress: boolean = false;
  moreData: boolean = true;

  constructor(public client: Client) {}

  ngOnInit() {}

  load(refresh: boolean = false) {
    if (this.inProgress) {
      return;
    }

    if (!this.category) {
      this.moreData = false;
      return;
    }

    this.inProgress = true;

    if (refresh) {
      this.featured = [];
      this.moreData = true;
    }

    this.client
      .get(`api/v1/categories/featured`, {
        categories: [this.category],
      })
      .then((response: any) => {
        //@todo: refactor if pagination (offset) is implemented
        this.moreData = false;
        this.inProgress = false;

        if (!response.entities) {
          this.inProgress = false;
          return;
        }

        this.featured.push(...response.entities);
      })
      .catch(e => {
        this.moreData = false;
        this.inProgress = false;
      });
  }

  setCategory(category: string) {
    this.category = category;
    this.load(true);
  }
}
