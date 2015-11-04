import { Component, View, NgFor, NgIf, FORM_DIRECTIVES, Inject} from 'angular2/angular2';
import { Router, RouteParams, Location } from 'angular2/router';
import { Client, Upload } from 'src/services/api';
import { Material } from 'src/directives/material';
import { InfiniteScroll } from 'src/directives/infinite-scroll';
import { MindsActivityObject } from 'src/interfaces/entities';

@Component({
  selector: 'minds-search-bar',
  host: {
    '(keyup)': 'keyup($event)'
  }
})
@View({
  template: '<div class="mdl-textfield mdl-js-textfield"> \
        <i class="material-icons">search</i> \
        <input class="mdl-textfield__input" type="text" id="search" [(ng-model)]="q"/> \
        <label class="mdl-textfield__label" for="search"> \
        </label> \
    </div>',
  directives: [ NgFor, NgIf, Material, FORM_DIRECTIVES ]
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

}
