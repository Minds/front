import { Component, View } from 'angular2/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from 'angular2/common';
import { Router, RouteParams, ROUTER_DIRECTIVES } from 'angular2/router';

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
  viewBindings: [ Client, Upload ],
//  inputs: [ "prepend" ]
})
@View({
  templateUrl: 'src/controllers/newsfeed/single/single.html',
  directives: [ Poster, CARDS, Material, CORE_DIRECTIVES, FORM_DIRECTIVES, ROUTER_DIRECTIVES,
    InfiniteScroll,  AnalyticsImpressions ]
})

export class NewsfeedSingle {


  session = SessionFactory.build();
  minds;
  inProgress : boolean = false;
  activity : MindsActivityObject;


	constructor(public client: Client, public upload: Upload, public router: Router, public params: RouteParams){
    if(params.params['guid'])
      this.load(params.params['guid']);
	}

	/**
	 * Load newsfeed
	 */
	load(guid : string){
		var self = this;
		this.client.get('api/v1/newsfeed/single/' + guid, { }, {cache: true})
				.then((data : any) => {
					self.activity = data.activity;
				})
				.catch(function(e){
					self.inProgress = false;
				});
	}

  delete(activity){
    this.router.navigate(['/Newsfeed']);
  }
}
