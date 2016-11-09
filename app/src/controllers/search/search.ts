import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Rx';

import { Client, Upload } from '../../services/api';
import { MindsTitle } from '../../services/ux/title';

@Component({
  moduleId: module.id,
  selector: 'minds-search',
  providers: [ MindsTitle ],
  templateUrl: 'list.html'
})

export class Search {

  q : string = "";
  type : string = "";

  entities: Array<Object> = [];
  offset : string = "";
  inProgress : boolean = false;
  moreData : boolean = true;

  constructor(public client: Client, public route: ActivatedRoute, public title: MindsTitle){
  }

  paramsSubscription: Subscription;
  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe(params => {
      if (params['q']) {
        this.q = decodeURIComponent(params['q']);
      }

      if (params['type']) {
        this.type = params['type'];
      }

      this.entities = [];
      this.inProgress = false;
      this.offset = '';

      this.search();
    });

    this.title.setTitle("Search");
  }
  
  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
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
