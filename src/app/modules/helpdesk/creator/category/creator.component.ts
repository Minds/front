import { Component, OnInit } from '@angular/core';
import { Client } from '../../../../services/api/client';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'm-helpdesk--category-creator',
  templateUrl: 'creator.component.html'
})

export class CategoryCreatorComponent implements OnInit {
  categories: Array<any> = [];

  error: string = null;

  category: any = {
    title: '',
    parent_uuid: null,
  };

  constructor(
    public client: Client,
    public router: Router,
    public route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.loadCategories();

    this.route.params.subscribe((params) => {
      if (params['uuid'] && params['uuid'] !== 'new') {
        this.load(params['uuid']);
      }
    });
  }

  trackCategories(index, category) {
    return category.uuid;
  }

  async loadCategories() {
    try {
      const response: any = await this.client.get(`api/v2/helpdesk/categories`, { limit: 200, recursive: true });
      this.categories = this.categoriesToArray(response.categories);
    } catch (e) {
      console.error(e);
    }
  }

  private categoriesToArray(categories: Array<any>) {
    const catArray = [];

    for (let category of categories) {
      catArray.push(category);

      let cat = category;
      while (cat.parent) {
        catArray.unshift(cat.parent);
        cat = cat.parent;
      }
    }

    // unique
    return catArray.filter((item, index, array) => array.findIndex((value) => value.uuid === item.uuid) === index);
  }

  private renderBranch(category) {
    // first get the whole branch
    let branch = [];
    let cat = category;
    while (cat) {
      branch.push(cat);
      cat = cat.parent;
    }

    let text = [];
    for (let i = branch.length - 1; i >= 0; --i) {
      text.push(branch[i].title);
    }

    return text.join(' > ');
  }

  selectCategory(category) {
    this.category.parent_uuid = category.uuid;
  }

  async load(uuid: string) {
    try {
      const response: any = await this.client.get(`api/v2/helpdesk/categories/category/${uuid}`);

      this.category = response.category;
    } catch (e) {
      console.error(e);
    }
  }

  validate() {
    this.error = null;
    
    if (!this.category.title) {
      this.error = 'You must provide a title';
    }

    if (this.error) {
      throw new Error();
    }
  }

  async save() {
    try {
      this.validate();
    } catch (e) {
      return;
    }

    try {
      await this.client.post('api/v2/admin/helpdesk/categories', { ...this.category })

      this.router.navigate(['/help']);
    } catch (e) {
      console.error(e);
      this.error = e;
    }
  }
}