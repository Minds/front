import { Component, Inject} from '@angular/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES, Location } from '@angular/common';
import { Router, RouteParams } from '@angular/router-deprecated';

import { Client, Upload } from '../../services/api';
import { Material } from '../../directives/material';
import { InfiniteScroll } from '../../directives/infinite-scroll';
import { MindsActivityObject } from '../../interfaces/entities';

import { SearchBarSuggestions } from './suggestions/suggestions';

@Component({
  selector: 'minds-search-bar',
  host: {
    '(keyup)': 'keyup($event)'
  },
  template: `
    <div class="mdl-textfield mdl-js-textfield">
        <i class="material-icons" (click)="onClick()">search</i>
        <input [(ngModel)]="q"
          class="mdl-textfield__input"
          type="text"
          id="search"
          autocomplete="off"
          />
        <label class="mdl-textfield__label" for="search"></label>
        <minds-search-bar-suggestions [q]="q"></minds-search-bar-suggestions>
    </div>
    `,
  directives: [ CORE_DIRECTIVES, Material, SearchBarSuggestions, FORM_DIRECTIVES ]
})

export class SearchBar {

  q : string;

  constructor(public router : Router){
  }

  ngOnInit() {
    this.listen();
  }

  listen(){
    this.router.subscribe((value: any) => {
      try {
        let route = `${value.instruction.urlPath}?${value.instruction.urlParams.join('&')}`;

        if(route.indexOf('search') == -1){
          this.q = "";
        } else {
          var r = route.substring(route.indexOf('q=')+2);
          if(r.indexOf('&type=') > 0)
            r = r.substring(0, r.indexOf('&type='));
          this.q = decodeURIComponent(r);
        }
      } catch (e) {
        console.error('Minds: router hook(SearchBar)', e);
      }
    });
  }

  search(){
    this.router.navigate(['/Search', { q: encodeURIComponent(this.q) }]);
  }

  keyup(e){
    if(e.keyCode == 13)
      this.search();
  }

  onClick(){
    document.getElementById("search").focus();
  }

}
