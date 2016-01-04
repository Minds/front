import { Component, View, Inject } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { Router, ROUTER_DIRECTIVES } from 'angular2/router';

import { Material } from '../../../directives/material';
import { Navigation as NavigationService } from '../../../services/navigation';
import { SessionFactory } from '../../../services/session';
import { MindsTitle } from '../../../services/ux/title';
import { Client } from '../../../services/api';
import { CARDS } from '../../../controllers/cards/cards';
import { BlogCard } from '../../../plugins/blog/card/card';
import { Register } from '../register/register';


@Component({
  selector: 'minds-homepage',
  bindings: [ Client, MindsTitle, NavigationService  ]
})
@View({
  templateUrl: 'src/controllers/home/homepage/homepage.html',
  directives: [ CORE_DIRECTIVES, ROUTER_DIRECTIVES, CARDS, BlogCard, Material, Register ]
})

export class Homepage {

  videos : Array<any> = [];
  blogs : Array<any> = [];
  channels : Array<any> = [];
  session = SessionFactory.build();

  constructor(public client: Client, public title: MindsTitle, public navigation: NavigationService){
    this.title.setTitle("Home");
    this.loadVideos();
    this.loadBlogs();
  }

  loadVideos(){
    this.client.get('api/v1/entities/featured/videos', { limit: 4 })
      .then((response : any) => {
        this.videos = response.entities;
      });
  }

  loadBlogs(){
    this.client.get('api/v1/blog/featured', { limit: 4 })
      .then((response : any) => {
        this.blogs = response.blogs;
      });
  }

}
