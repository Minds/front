import { Component, View, Inject, CORE_DIRECTIVES } from 'angular2/angular2';
import { Router, RouteParams, ROUTER_DIRECTIVES } from 'angular2/router';
import { Client } from 'src/services/api';
import { Material } from 'src/directives/material';
import { MindsTitle } from 'src/services/ux/title';
import { Navigation as NavigationService } from 'src/services/navigation';

@Component({
  providers: [ MindsTitle, Client, NavigationService ]
})
@View({
  templateUrl: 'src/controllers/pages/pages.html',
  directives: [ CORE_DIRECTIVES, ROUTER_DIRECTIVES, Material ]
})

export class Pages {

  title : string = "";
  body : string = "";
  path : string = "";

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
          this.titleService.setTitle(this.title);
      });
  }

  setUpMenu(){
    this.pages = this.navigation.getItems('footer');
    console.log(this.pages);
  }

}
