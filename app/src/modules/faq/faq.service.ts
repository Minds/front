import { Injectable } from '@angular/core';

import { Client } from '../../services/api';
import { Session } from '../../services/session';

@Injectable()
export class FaqService {

  private faq = [];

  constructor(
    private client: Client,
    private session: Session,
  ) { }

  async load() {
    return this.client.get(`api/v2/faq`)
      .then((response: any) => {
        this.faq = response.faq;
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

    this.faq[category].id = category;

    return [
      this.faq[category]
    ];
  }

}
