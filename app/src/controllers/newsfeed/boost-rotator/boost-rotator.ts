import { Component, ElementRef } from 'angular2/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from 'angular2/common';
import { Observable } from 'rxjs/Rx';
import { Router, ROUTER_DIRECTIVES } from 'angular2/router';

import { ScrollService } from '../../../services/ux/scroll';
import { Client, Upload } from '../../../services/api';
import { CARDS } from '../../cards/cards';


@Component({
  selector: 'minds-newsfeed-boost-rotator',
  inputs: ['interval'],
  templateUrl: 'src/controllers/newsfeed/boost-rotator/boost-rotator.html',
  directives: [ CORE_DIRECTIVES, ROUTER_DIRECTIVES, CARDS ]
})

export class NewsfeedBoostRotator {

  boosts : Array<any> = [];
  offset : string = "";
  inProgress : boolean = false;
  moreData : boolean = true;
  rotator;
  running : boolean = false;
  interval : number = 10;
  currentPosition : number = 0;
  minds;
  scroll_listener;

	constructor(public client: Client, public scroll : ScrollService, public element: ElementRef){
    this.load();
    this.scroll_listener = this.scroll.listen(() => this.isVisible(), 200);
	}

	/**
	 * Load newsfeed
	 */
	load(){

    if(this.inProgress){
      return false;
    }
    this.inProgress = true;

		this.client.get('api/v1/boost/fetch/newsfeed', {limit:6})
			.then((response : any) => {
        if(!response.boosts){
          this.inProgress = false;
          return false;
        }
        if(this.boosts.length >= 12){
          this.boosts = response.boosts;
          this.recordImpression(0);
        } else {
          this.boosts = this.boosts.concat(response.boosts);
          this.currentPosition = this.currentPosition+1;
        }
        this.start();
        this.isVisible();
			  this.inProgress = false;
			})
			.catch(function(e){
				this.inProgress = false;
			});
	}

  start(){
    if(this.rotator)
      window.clearInterval(this.rotator);
    this.running = true;
    this.rotator = setInterval((e) => {
      if(this.currentPosition + 1 > this.boosts.length -1){
        this.currentPosition = 0;
        this.load();
      } else {
        this.currentPosition++;
      }
      this.recordImpression(this.currentPosition);
    }, this.interval*1000);
  }

  isVisible(){
    var bounds = this.element.nativeElement.getBoundingClientRect();
    if(bounds.top + bounds.height > 0){
      //console.log('[rotator]: in view', this.rotator);
      if(!this.running)
        this.start();
    } else {
      //console.log('[rotator]: out of view', this.rotator);
      if(this.running){
        this.running = false;
        window.clearInterval(this.rotator);
      }
    }
  }

  recordImpression(position : number){
    this.client.put('api/v1/boost/fetch/newsfeed/' + this.boosts[position].boosted_guid);
  }

  ngOnDestroy(){
    this.scroll.unListen(this.scroll_listener);
  }

}
