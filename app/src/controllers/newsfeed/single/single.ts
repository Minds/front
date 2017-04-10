import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Rx';

import { Client, Upload } from '../../../services/api';
import { MindsActivityObject } from '../../../interfaces/entities';
import { SessionFactory } from '../../../services/session';

@Component({
  moduleId: module.id,
  selector: 'minds-newsfeed-single',
  templateUrl: 'single.html'
})

export class NewsfeedSingle {


  session = SessionFactory.build();
  minds;
  inProgress : boolean = false;
  activity : any;


	constructor(public client: Client, public upload: Upload, public router: Router, public route: ActivatedRoute){
  }
  
  paramsSubscription: Subscription;
  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe(params => {
      if (params['guid']) {
        this.activity = void 0;
        this.load(params['guid']);
      }
    });
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
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
                this.router.navigate(['/archive/view', this.activity.guid], { replaceUrl: true });
                break;
              case 'blog':
                this.router.navigate(['/blog/view', this.activity.guid], { replaceUrl: true });
                break;
            }
				})
				.catch(function(e){
					this.inProgress = false;
				});
	}

  delete(activity){
    this.router.navigate(['/newsfeed']);
  }
}
