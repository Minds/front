import { Component } from '@angular/core';
import { CORE_DIRECTIVES } from '@angular/common';
import { Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

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
  providers: [ MindsTitle, NavigationService ],
  templateUrl: 'src/controllers/home/homepage/homepage.html',
  directives: [ CORE_DIRECTIVES, ROUTER_DIRECTIVES, FORM_COMPONENTS, CARDS, BlogCard, Material, Register ]
})

export class Homepage {

  videos : Array<any> = [];
  blogs : Array<any> = [];
  channels : Array<any> = [];
  stream = {
    1: [],
    2: [],
    3: []
  };

  session = SessionFactory.build();
  minds = window.Minds;

  flags = {
    canPlayInlineVideos: true
  };

  constructor(public client: Client, public title: MindsTitle, public router : Router, public navigation: NavigationService, private modal : SignupModalService){
    this.title.setTitle("Home");
    this.loadStream();
    //this.loadVideos();
    //this.loadBlogs();

    if (/iP(hone|od)/.test(window.navigator.userAgent)) {
      this.flags.canPlayInlineVideos = false;
    }
  }

  loadStream(){
    this.client.get('api/v1/newsfeed/featured', { limit: 24 })
      .then((response : any) => {
        let col = 0;
        for(let activity of response.activity){
          //split stream into 3 columns
          if(col++ >= 3)
            col = 1;
          this.stream[col].push(activity);
        }
      });
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
    this.router.navigate(['/Newsfeed', {}]);
  }

}
