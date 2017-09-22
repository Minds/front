import { Component, Inject, Input } from '@angular/core';
import { Location } from '@angular/common';

import { Client, Upload } from '../../../services/api';


@Component({
  selector: 'minds-search-bar-suggestions',
  host: {
    '(window:click)': 'onWindowClick($event)',
    '(window:keydown)': 'onKey($event)'
  },
  template: `
      <div class="m-search-bar-suggestions-list" [hidden]="!showResults || !suggestions || !suggestions.length">
        <a class="m-search-bar-suggestions-suggestion"
           *ngFor="let suggestion of suggestions"
           [routerLink]="['/', suggestion.payload.username]">
           <img src="icon/{{suggestion.payload.guid}}/small"/> @{{suggestion.payload.username}}
        </a>
      </div>
    `
})

export class SearchBarSuggestions {

  suggestions: Array<any> = [];
  showResults: boolean = false;
  timeout;

  constructor(public client: Client, public location: Location) {
  }

  @Input('q')
  set q(q: string) {
    if (!q || this.location.path().indexOf('/search') === 0) {
      this.suggestions = [];
      return;
    }
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.client.get('api/v1/search/suggest', { q: q })
        .then((response: any) => {
          this.showResults = true;
          this.suggestions = response.suggestions;
        });
    }, 300);
  }

  onWindowClick(e) {
    if (e.target.id === 'search') {
      this.showResults = true;
      return;
    }
    this.showResults = false;
  }

  onKey(e) {
    if (e.key === 'Enter')
      this.showResults = false;
  }

}
