import { Component, View, Inject} from 'angular2/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from 'angular2/common';
import { Router, RouteParams, Location } from 'angular2/router';

import { Client, Upload } from '../../services/api';
import { Material } from '../../directives/material';
import { InfiniteScroll } from '../../directives/infinite-scroll';
import { MindsActivityObject } from '../../interfaces/entities';


@Component({
  selector: 'minds-search-bar',
  host: {
    '(keyup)': 'keyup($event)'
  }
})
@View({
  template: `
    <div class="mdl-textfield mdl-js-textfield">
        <i class="material-icons" (click)="onClick()">search</i>
        <input class="mdl-textfield__input" type="text" id="search" [(ngModel)]="q"/>
        <label class="mdl-textfield__label" for="search"></label>
    </div>`,
  directives: [ CORE_DIRECTIVES, Material, FORM_DIRECTIVES ]
})

export class SearchBar {

  q : string = "";

  constructor(public router : Router){
    this.listen();
  }

  listen(){
    this.router.subscribe((route : string) => {
      if(route.indexOf('search') == -1){
        this.q = "";
      } else {
        var r = route.substring(route.indexOf('q=')+2);
        if(r.indexOf('&type=') > 0)
          r = r.substring(0, r.indexOf('&type='));
        this.q = decodeURI(r);
      }
    });
  }

  search(){
    this.router.navigate(['/Search', {q: this.q}]);
  }

  keyup(e){
    if(e.keyCode == 13)
      this.search();
  }

  onClick(){
    document.getElementById("search").focus();
  }

}
