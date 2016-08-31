import { Component, Inject, Input } from '@angular/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES, Location } from '@angular/common';
import { Router, RouteParams, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { Client, Upload } from '../../../services/api';


@Component({
  selector: 'minds-search-bar-suggestions',
  host: {
    '(window:click)': 'onWindowClick($event)'
  },
  template: `
      <div class="m-search-bar-suggestions-list" [hidden]="!showResults || !suggestions || !suggestions.length">
        <a class="m-search-bar-suggestions-suggestion" 
           *ngFor="let suggestion of suggestions"
           [routerLink]="['/Channel', {username: suggestion.payload.username}]">
           <img src="icon/{{suggestion.payload.guid}}/small"/> @{{suggestion.payload.username}}
        </a>
      </div>
    `,
  directives: [ CORE_DIRECTIVES, ROUTER_DIRECTIVES, FORM_DIRECTIVES ]
})

export class SearchBarSuggestions {

  suggestions : Array<any> = [];
  showResults : boolean = false;
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
          this.showResults = true;
          this.suggestions = response.suggestions;
        })
    }, 300);
  }

  onWindowClick(e) {
    if(e.target.id == "search"){
      this.showResults = true;
      return;
    }
    this.showResults = false;
   }

}
