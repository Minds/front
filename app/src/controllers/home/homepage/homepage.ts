import { Component } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { Router, ROUTER_DIRECTIVES } from 'angular2/router';

import { FORM_COMPONENTS } from '../../../components/forms/forms';

import { Material } from '../../../directives/material';
import { Navigation as NavigationService } from '../../../services/navigation';
import { SessionFactory } from '../../../services/session';
import { MindsTitle } from '../../../services/ux/title';
import { Client } from '../../../services/api';
import { CARDS } from '../../../controllers/cards/cards';
import { BlogCard } from '../../../plugins/blog/card/card';
import { Register } from '../register/register';
import { SignupModalService } from '../../../components/modal/signup/service';

@Component({
  selector: 'minds-homepage',
  bindings: [ MindsTitle, NavigationService ],
  templateUrl: 'src/controllers/home/homepage/homepage.html',
  directives: [ CORE_DIRECTIVES, ROUTER_DIRECTIVES, FORM_COMPONENTS, CARDS, BlogCard, Material, Register ]
})

export class Homepage {

  videos : Array<any> = [];
  blogs : Array<any> = [];
  channels : Array<any> = [];
  session = SessionFactory.build();
  minds = window.Minds;

  flags = {
    canPlayInlineVideos: true
  };

  constructor(public client: Client, public title: MindsTitle, public router : Router, public navigation: NavigationService, private modal : SignupModalService){
    this.title.setTitle("Home");
    this.loadVideos();
    this.loadBlogs();

    if (/iP(hone|od)/.test(window.navigator.userAgent)) {
      this.flags.canPlayInlineVideos = false;
    }
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

  registered(){
    this.modal.setDisplay('onboarding').open();
    this.router.navigate(['/Discovery', {filter:'suggested', 'type': 'channels'}]);
  }

}
