import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Rx';

import { Client, Upload } from '../../../services/api';

@Component({
  moduleId: module.id,
  selector: 'minds-admin-boosts',
  host: {
    '(keydown)': 'onKeyDown($event)'
  },
  templateUrl: 'boosts.html'
})

export class AdminBoosts {

  boosts : Array<any> = [];
  type : string = "newsfeed";
  count : number = 0;
  newsfeed_count : number = 0;
  suggested_count : number = 0;

  ratingOptions = [
    {
      id : 1,
      name : "Universal"
    },
    {
      id : 2,
      name : "Mainstream"
    },
    {
      id : 3,
      name : "Mature"
    }
  ];
  
  inProgress : boolean = false;
  moreData : boolean = true;
  offset : string = "";

  constructor(public client: Client, private route: ActivatedRoute){
  }

  paramsSubscription: Subscription;
  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe((params) => {
      if (params['type']) {
        this.type = params['type'];
      } else {
        this.type = 'newsfeed';
      }

      this.boosts = [];
      this.count = 0;
      this.newsfeed_count = 0;
      this.suggested_count = 0;
      this.inProgress = false;
      this.moreData = true;
      this.offset = "";

      this.load();
    });

    this.domHack();
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
    this.undoDomHack();
  }

  load(){
    if(this.inProgress)
      return;
    this.inProgress = true;

    this.client.get('api/v1/admin/boosts/' + this.type, { limit: 24, offset: this.offset })
      .then((response : any) => {
        if(!response.boosts){
          this.inProgress = false;
          this.moreData = false;
          return;
        }

        this.boosts = this.boosts.concat(response.boosts);
        this.count = response.count;
        this.newsfeed_count = response.newsfeed_count;
        this.suggested_count = response.suggested_count;

        this.offset = response['load-next'];
        this.inProgress = false;
      })
      .catch((e) => {
        this.inProgress = false;
      });
  }

  domHack(){
    var self = this;
    document.addEventListener('keydown', self.onKeypress);
  }

  accept(boost : any = null){
    if(!boost)
      boost = this.boosts[0];

    this.client.post('api/v1/admin/boosts/' + this.type + '/' + boost.guid  + '/accept', { rating : boost.rating })
      .then((response : any) => {

      })
      .catch((e) => {

      });
    this.pop(boost);
  }

  reject(boost : any = null){
    if(!boost)
      boost = this.boosts[0];

    this.client.post('api/v1/admin/boosts/' + this.type + '/' + boost.guid  + '/reject')
      .then((response : any) => {

      })
      .catch((e) => {

      });
    this.pop(boost);
  }

  /**
   * Remove an entity from the list
   */
  pop(boost) {
    let i: any;
    for(i in this.boosts){
      if(boost == this.boosts[i])
        this.boosts.splice(i,1);
    }
    if(this.type == "newsfeed")
      this.newsfeed_count--;
    else if(this.type == "suggested")
      this.suggested_count--;
    if(this.boosts.length < 5)
      this.load();
  }

  onKeyDown(e){
    //e.preventDefault();
    e.stopPropagation()
    if(e.keyCode == 37)
      return this.accept();
    if(e.keyCode == 39)
      return this.reject();
  }

  /**
   * Hack to make host keypress listen
   */
  onKeypress(e){
    var event = new KeyboardEvent('keydown', e);
    document.getElementsByTagName('minds-admin-boosts')[0].dispatchEvent(event);
  }

  undoDomHack(){
    document.removeEventListener('keydown', this.onKeypress);
  }

}
