import { Component, Inject, Input } from '@angular/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES, Location } from '@angular/common';
import { Router, RouteParams } from '@angular/router-deprecated';

import { Client, Upload } from '../../../services/api';


@Component({
  selector: 'minds-search-bar-suggestions',
  template: `
      <div class="m-search-bar-suggestions-list" [hidden]="!suggestions || !suggestions.length">
        <div class="m-search-bar-suggestions-suggestion" *ngFor="let suggestion of suggestions">
          {{suggestion.text}}
        </div>
      </div>
    `,
  directives: [ CORE_DIRECTIVES, FORM_DIRECTIVES ]
})

export class SearchBarSuggestions {

  suggestions : Array<any> = [];
  timeout;

  constructor(public client : Client, public router : Router){
  }

  @Input('q')
  set q(q : string) {
    if(!q)
      this.suggestions = [];

    if(this.timeout){
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.client.get('api/v1/search/suggest', { q: q })
        .then((response : any) => {
          this.suggestions = response.suggestions;
        })
    }, 300);
  }

}
