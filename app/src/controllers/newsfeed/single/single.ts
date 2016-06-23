import { Component } from '@angular/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from '@angular/common';
import { Router, RouteParams, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { Client, Upload } from '../../../services/api';
import { Material } from '../../../directives/material';
import { InfiniteScroll } from '../../../directives/infinite-scroll';
import { Poster } from '../poster/poster';
import { CARDS } from '../../../controllers/cards/cards';
import { MindsActivityObject } from '../../../interfaces/entities';
import { SessionFactory } from '../../../services/session';

import { AnalyticsImpressions } from '../../../components/analytics/impressions';


@Component({
  selector: 'minds-newsfeed-single',
  templateUrl: 'src/controllers/newsfeed/single/single.html',
  directives: [ Poster, CARDS, Material, CORE_DIRECTIVES, FORM_DIRECTIVES, ROUTER_DIRECTIVES,
    InfiniteScroll,  AnalyticsImpressions ]
})

export class NewsfeedSingle {


  session = SessionFactory.build();
  minds;
  inProgress : boolean = false;
  activity : any;


	constructor(public client: Client, public upload: Upload, public router: Router, public params: RouteParams){
    if(params.params['guid'])
      this.load(params.params['guid']);
	}

	/**
	 * Load newsfeed
	 */
	load(guid : string){
		this.client.get('api/v1/newsfeed/single/' + guid, { }, {cache: true})
				.then((data : any) => {
            this.activity = data.activity;

            switch(this.activity.subtype){
              case 'image':
              case 'video':
              case 'album':
                this.router.navigate(['/Archive-View', {guid: this.activity.guid}]);
                break;
              case 'blog':
                this.router.navigate(['/Blog-View', {guid: this.activity.guid}]);
                break;
            }
				})
				.catch(function(e){
					this.inProgress = false;
				});
	}

  delete(activity){
    this.router.navigate(['/Newsfeed']);
  }
}
