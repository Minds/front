import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Rx';

import { Client, Upload } from '../../services/api';
import { MindsTitle } from '../../services/ux/title';
import { SessionFactory } from '../../services/session';
import { ScrollService } from '../../services/ux/scroll';

import { MindsActivityObject } from '../../interfaces/entities';
import { MindsUser } from '../../interfaces/entities';
import { MindsChannelResponse } from '../../interfaces/responses';
import { Poster } from "../../modules/legacy/controllers/newsfeed/poster/poster";

@Component({
  moduleId: module.id,
  selector: 'minds-channel',
  templateUrl: 'channel.html'
})

export class Channel {

  _filter : string = "feed";
  session = SessionFactory.build();
  isLocked : boolean = false;

  username : string;
  user : MindsUser;
  feed : Array<Object> = [];
  offset : string = "";
  moreData : boolean = true;
  inProgress : boolean = false;
  editing : boolean = false;
  editForward : boolean = false;
  error: string = "";

  //@todo make a re-usable city selection module to avoid duplication here
  cities : Array<any> = [];

    @ViewChild('poster') private poster: Poster;

  constructor(public client: Client, public upload: Upload, private route: ActivatedRoute,
    public title: MindsTitle, public scroll : ScrollService){
  }

  showOnboarding: boolean = false;
  paramsSubscription: Subscription;
  ngOnInit() {
    this.title.setTitle("Channel");
    this.onScroll();

    this.paramsSubscription = this.route.params.subscribe((params) => {
      let changed = false;

      if (params['username']) {
        changed = this.username !== params['username'];
        this.username = params['username'];
      }

      if (params['filter']) {
        this._filter = params['filter'];
      }

      if (params['editToggle']) {
        this.editing = true;
        this.editForward = true;
        this.showOnboarding = true;
      }

      if (changed) {
        this.load();
      }
    });
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  load(){
    this.error = "";

    this.user = null;
    this.title.setTitle(this.username);

    this.client.get('api/v1/channel/' + this.username, {})
      .then((data : MindsChannelResponse) => {
        if(data.status != "success"){
          this.error = data.message;
          return false;
        }
        this.user = data.channel;
        this.title.setTitle(this.user.username);

        if(this._filter == "feed")
          this.loadFeed(true);
      })
      .catch((e) => {
        if (e.status === 0) {
          this.error = "Sorry, there was a timeout error.";
        } else {
          this.error = "Sorry, the channel couldn't be found";
          console.log('couldnt load channel', e);
        }
      });
  }

  loadFeed(refresh : boolean = false){
    if(this.inProgress){
      return false;
    }

    if (refresh) {
      this.feed = [];
      this.offset = "";
    }

    this.inProgress = true;

    this.client.get('api/v1/newsfeed/personal/' + this.user.guid, {limit:12, offset: this.offset}, {cache: true})
        .then((data : MindsActivityObject) => {
          if(!data.activity){
            this.moreData = false;
            this.inProgress = false;
            return false;
          }
          if(this.feed && !refresh){
            for(let activity of data.activity)
              this.feed.push(activity);
          } else {
               this.feed = data.activity;
          }
          this.offset = data['load-next'];
          this.inProgress = false;
        })
        .catch(function(e){
          this.inProgress = false;
        });
  }

  isOwner(){
    return this.session.getLoggedInUser().guid == this.user.guid;
  }

  toggleEditing(){
    if(this.editing){
      this.update();
    }
    this.editing = !this.editing;
  }

  onScroll(){
    var listen = this.scroll.listen((view) => {
      if(view.top > 250)
        this.isLocked = true;
      if(view.top < 250)
        this.isLocked = false;
    });
  }

  updateCarousels(value : any){

    if(!value.length)
      return;
    for(var banner of value){
      var options : any = { top: banner.top };
      if(banner.guid)
        options.guid = banner.guid;
      this.upload.post('api/v1/channel/carousel', [banner.file], options)
        .then((response : any) => {
          response.index = banner.index;
          this.user.carousels[banner.index] = response.carousel;
        });
    }

  }

  removeCarousel(value : any){
    if(value.guid)
      this.client.delete('api/v1/channel/carousel/' + value.guid);
  }

  update(){
    this.client.post('api/v1/channel/info', this.user)
      .then((data : any) => {
        this.editing = false;
        if(this.editForward){
        //  this.router.navigate(['/Discovery', {filter: 'suggested', type:'channels'}]);
        }
      });
  }

  delete(activity) {
    let i: any;
    for(i in this.feed){
      if(this.feed[i] == activity)
        this.feed.splice(i,1);
    }
  }

  prepend(activity : any){
    activity.boostToggle = true;
    this.feed.unshift(activity);
  }

  upload_avatar(file){
    var self = this;
    this.upload.post('api/v1/channel/avatar', [file], {filekey : 'file'})
      .then((response : any) => {
        self.user.icontime = Date.now();
        window.Minds.user.icontime = Date.now();
      })
      .catch((exception)=>{
      });
  }

  searching;
  findCity(q : string){
    if(this.searching){
      clearTimeout(this.searching);
    }
    this.searching = setTimeout(() => {
      this.client.get('api/v1/geolocation/list', {	q: q })
        .then((response : any) => {
          this.cities = response.results;
        });
    }, 100);
  }

  setCity(row : any){
    this.cities = [];
    if(row.address.city)
      window.Minds.user.city = row.address.city;
    if(row.address.town)
      window.Minds.user.city = row.address.town;
    this.user.city = window.Minds.user.city;
    this.client.post('api/v1/channel/info', {
        coordinates : row.lat + ',' + row.lon,
        city : window.Minds.user.city
      });
  }

  setSocialProfile(value: any) {
    this.user.social_profiles = value;
  }

  unBlock(){
    this.user.blocked = false;
    this.client.delete('api/v1/block/' + this.user.guid, {})
      .then((response : any) => {
        this.user.blocked = false;
      })
      .catch((e) => {
        this.user.blocked = true;
      });
  }

  canDeactivate(){
    if(!this.poster || !this.poster.attachment)
      return true;
    const progress = this.poster.attachment.getUploadProgress();
    if (progress > 0 && progress < 100) {
      return confirm('Your file is still uploading. Are you sure?');
    }

    return true;
  }
}

export { ChannelSubscribers } from './subscribers/subscribers';
export { ChannelSubscriptions } from './subscriptions/subscriptions';
