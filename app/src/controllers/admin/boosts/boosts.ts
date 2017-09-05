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
  content_count : number = 0;
  
  inProgress : boolean = false;
  moreData : boolean = true;
  offset : string = "";

  statistics: any = null;

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
      this.inProgress = false;
      this.moreData = true;
      this.offset = "";

      this.load()
        .then(() => {
          this.loadStatistics();
        });
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

    return this.client.get('api/v1/admin/boosts/' + this.type, { limit: 24, offset: this.offset })
      .then((response : any) => {
        if(!response.boosts){
          this.inProgress = false;
          this.moreData = false;
          return;
        }

        this.boosts = this.boosts.concat(response.boosts);
        this.count = response.count;
        this.newsfeed_count = response.newsfeed_count;
        this.content_count = response.content_count;

        this.offset = response['load-next'];
        this.inProgress = false;
      })
      .catch((e) => {
        this.inProgress = false;
      });
  }

  loadStatistics() {
    this.statistics = null;

    return this.client.get(`api/v1/admin/boosts/analytics/${this.type}`)
      .then((response) => {
        this.statistics = response;
      })
      .catch(e => {
        console.error('[Minds Admin] Cannot load boost statistics', e);
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
    else if(this.type == "content")
      this.content_count--;
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

  // TODO: Please, convert this to a pipe (and maybe add days support)!
  _duration(duration: number): string {
    const minsDuration = Math.floor(duration / (60000)),
      mins = minsDuration % 60,
      hours = Math.floor(minsDuration / 60);

    return `${hours}:${this._padStart('' + mins, 2, '0')}`;
  }

  private _padStart(str: string, targetLength, padString) {
    targetLength = targetLength>>0; //floor if number or convert non-number to 0;
    padString = String(padString || ' ');
    if (str.length > targetLength) {
      return String(str);
    }
    else {
      targetLength = targetLength-str.length;
      if (targetLength > padString.length) {
        padString += padString.repeat(targetLength/padString.length); //append to original to ensure we are longer than needed
      }
      return padString.slice(0,targetLength) + String(str);
    }
  }
}
