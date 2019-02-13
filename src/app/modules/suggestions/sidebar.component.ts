import { Component } from '@angular/core';
import { Client } from '../../services/api';

@Component({
  selector: 'm-suggestions__sidebar',
  templateUrl: 'sidebar.component.html'
})

export class SuggestionsSidebar {

  minds = window.Minds;
  suggestions: Array<any> = [];

  constructor(
    private client: Client,
  ) {
  }

  ngOnInit() {
    this.load();
  }

  async load() {
    let response: any = await this.client.get('api/v2/suggestions/user', { limit: 5 });
    this.suggestions = response.suggestions;
  }

}
