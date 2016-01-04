import { Component, View } from 'angular2/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from 'angular2/common';
import { Router, RouteParams, Location, ROUTER_DIRECTIVES } from 'angular2/router';

import { Client, Upload } from '../../services/api';
import { MindsTitle } from '../../services/ux/title';
import { Material } from '../../directives/material';
import { InfiniteScroll } from '../../directives/infinite-scroll';
import { CARDS } from '../../controllers/cards/cards';
import { BlogCard } from '../../plugins/blog/card/card';


@Component({
  selector: 'minds-search',
  viewBindings: [ Client ],
  bindings: [ MindsTitle ]
})
@View({
  templateUrl: 'src/controllers/search/list.html',
  directives: [ CORE_DIRECTIVES, Material, FORM_DIRECTIVES, ROUTER_DIRECTIVES,
    CARDS, BlogCard, InfiniteScroll ]
})

export class Search {

  q : string = "";
  type : string = "";

  entities: Array<Object> = [];
  offset : string = "";
  inProgress : boolean = false;
  moreData : boolean = true;

  constructor(public client: Client, public params : RouteParams, public title: MindsTitle){
    this.q = params.params['q'];
    if(params.params['type'])
      this.type = params.params['type'];
  	this.search();

    this.title.setTitle("Search");
  }

  /**
   * Search
   */
   search(refresh : boolean = true){
     if(this.inProgress)
      return;

    this.inProgress = true;

    this.client.get('api/v1/search', { q: this.q, type: this.type, limit: 12, offset: this.offset })
      .then((response: any) => {
        if(!response.entities || response.entities.length == 0){
          this.inProgress = false;
          return;
        }
        this.entities = this.entities.concat(response.entities);
        this.offset = response['load-next'];
        this.inProgress = false;
      })
      .catch((e) => {
        this.inProgress = false;
      });
   }
}
