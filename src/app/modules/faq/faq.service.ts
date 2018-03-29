import { Injectable } from '@angular/core';

import { Client } from '../../services/api';
import { Session } from '../../services/session';

@Injectable()
export class FaqService {

  private faq = [];

  private inProgress: boolean = false;

  constructor(
    private client: Client,
    private session: Session,
  ) { }

  async load() {
    this.inProgress = true;
    return this.client.get(`api/v2/faq`)
      .then((response: any) => {
        this.faq = response.faq;
        this.inProgress = false;
      });
  }

  async get(category: string) {
    if (!this.faq || this.faq.length === 0) {
      await this.load();
    }

    if (!category || category == 'all') {
      return Object.keys(this.faq)
        .map((key) => {
          this.faq[key].id = key;
          return this.faq[key];
        });
    }

    if (!this.faq[category]) {
      return [];
    }

    this.faq[category].id = category;

    return [
      this.faq[category]
    ];
  }

}
