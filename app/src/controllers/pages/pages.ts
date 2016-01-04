import { Component, View, Inject } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { Router, RouteParams, ROUTER_DIRECTIVES } from 'angular2/router';

import { Client } from '../../services/api';
import { Material } from '../../directives/material';
import { MindsTitle } from '../../services/ux/title';
import { Navigation as NavigationService } from '../../services/navigation';
import { MindsBanner } from '../../components/banner';


@Component({
  providers: [ MindsTitle, Client, NavigationService ]
})
@View({
  templateUrl: 'src/controllers/pages/pages.html',
  directives: [ CORE_DIRECTIVES, ROUTER_DIRECTIVES, Material, MindsBanner ]
})

export class Pages {

  title : string = "";
  body : string = "";
  path : string = "";
  header : boolean = false;
  headerTop : number = 0;

  pages : Array<any> = [];

  constructor(public titleService: MindsTitle, public client: Client, public navigation : NavigationService, public params: RouteParams){
    this.titleService.setTitle("...");
    this.load();
    this.setUpMenu();
  }

  load(){
    this.client.get('api/v1/admin/pages/' + this.params.params['page'])
      .then((response : any) => {
          this.title = response.title;
          this.body = response.body;
          this.path = response.path;
          this.header = response.header;
          this.headerTop = response.headerTop;
          this.titleService.setTitle(this.title);
      });
  }

  setUpMenu(){
    this.pages = this.navigation.getItems('footer');
    console.log(this.pages);
  }

}
