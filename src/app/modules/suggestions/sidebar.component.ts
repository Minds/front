import { Component } from '@angular/core';
import { Client } from '../../services/api';

@Component({
  selector: 'm-suggestions__sidebar',
  templateUrl: 'sidebar.component.html'
})

export class SuggestionsSidebar {

  minds = window.Minds;
  suggestions: Array<any> = [];
  lastOffset = 0;

  constructor(
    private client: Client,
  ) {
  }

  ngOnInit() {
    this.load();
  }

  async load() {
    let limit: number = 5;

    if (this.suggestions.length)
      limit = 1;

    // Subscribe can not rely on next batch, so load further batch
    this.lastOffset = this.suggestions.length ? this.lastOffset + 11 : 0;

    let response: any = await this.client.get('api/v2/suggestions/user', { 
      limit,
      offset: this.lastOffset,
    });
    for (let suggestion of response.suggestions) {
      this.suggestions.push(suggestion);
    }
  }

  async pass(suggestion, e) {
    e.preventDefault();
    e.stopPropagation();
    this.suggestions.splice(this.suggestions.indexOf(suggestion), 1);
    await this.client.put(`api/v2/suggestions/pass/${suggestion.entity_guid}`);

    // load more
    this.load();
  }

  remove(suggestion) {
    this.suggestions.splice(this.suggestions.indexOf(suggestion), 1);

    // load more
    this.load();
  }

}
