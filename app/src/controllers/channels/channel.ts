import { Component, View, CORE_DIRECTIVES, FORM_DIRECTIVES, Inject } from 'angular2/angular2';
import { Router, ROUTER_DIRECTIVES, RouteParams } from 'angular2/router';
import { Client, Upload } from '../../services/api';
import { MindsTitle } from '../../services/ux/title';
import { Material } from '../../directives/material';
import { SessionFactory } from '../../services/session';
import { ScrollFactory } from '../../services/ux/scroll';
import { InfiniteScroll } from '../../directives/infinite-scroll';
import { BUTTON_COMPONENTS } from '../../components/buttons';
import { MindsCarousel } from '../../components/carousel';
import { TagsPipe } from '../../pipes/tags';

import { AutoGrow } from '../../directives/autogrow';
import { CARDS } from '../../controllers/cards/cards';
import { MindsActivityObject } from '../../interfaces/entities';
import { MindsUser } from '../../interfaces/entities';
import { MindsChannelResponse } from '../../interfaces/responses';
import { Poster } from '../../controllers/newsfeed/poster/poster';
import { MindsAvatar } from '../../components/avatar';

import { ChannelModules } from './modules/modules';
import { ChannelSubscribers } from './subscribers/subscribers';
import { ChannelSubscriptions } from './subscriptions/subscriptions';
import { ChannelEdit } from './edit/edit';

@Component({
  selector: 'minds-channel',
  viewBindings: [ Client, Upload ],
  bindings: [ MindsTitle ]
})
@View({
  templateUrl: 'src/controllers/channels/channel.html',
  pipes: [ TagsPipe ],
  directives: [ ROUTER_DIRECTIVES, CORE_DIRECTIVES, FORM_DIRECTIVES, Material, InfiniteScroll, CARDS,
    AutoGrow, ChannelSubscribers, ChannelSubscriptions, BUTTON_COMPONENTS, ChannelEdit, MindsCarousel,
    Poster, MindsAvatar, ChannelModules ]
})

export class Channel {

  _filter : string = "feed";
  session = SessionFactory.build();
  scroll = ScrollFactory.build();
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

  constructor(public client: Client, public upload: Upload, params: RouteParams, public router: Router, public title: MindsTitle){
      this.username = params.params['username'];
      if(params.params['filter'])
        this._filter = params.params['filter'];

      if(params.params['editToggle']){
        this.editing = true;
        this.editForward = true;
      }

      this.title.setTitle("Channel");
      this.load();
      this.onScroll();

  }

  load(){
    var self = this;

    this.client.get('api/v1/channel/' + this.username, {})
    .then((data : MindsChannelResponse) => {
      if(data.status != "success"){
        self.error = data.message;
        return false;
      }
      self.user = data.channel;
      this.title.setTitle(self.user.username);

      if(self._filter == "feed")
      self.loadFeed(true);
    })
    .catch((e) => {
      console.log('couldnt load channel', e);
    });
  }

  loadFeed(refresh : boolean = false){
    var self = this;
    if(this.inProgress){
      //console.log('already loading more..');
      return false;
    }

    if(refresh){
      this.offset = "";
    }

    this.inProgress = true;

    this.client.get('api/v1/newsfeed/personal/' + this.user.guid, {limit:12, offset: this.offset}, {cache: true})
        .then((data : MindsActivityObject) => {
          if(!data.activity){
            self.moreData = false;
            self.inProgress = false;
            return false;
          }
          if(self.feed && !refresh){
            for(let activity of data.activity)
              self.feed.push(activity);
          } else {
               self.feed = data.activity;
          }
          self.offset = data['load-next'];
          self.inProgress = false;
        })
        .catch(function(e){
          self.inProgress = false;
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

  delete(activity){
    for(var i in this.feed){
      if(this.feed[i] == activity)
        this.feed.splice(i,1);
    }
  }

  prepend(activity : any){
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

  searching : number;
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

}

export { ChannelSubscribers } from './subscribers/subscribers';
export { ChannelSubscriptions } from './subscriptions/subscriptions';
export { ChannelEdit } from './edit/edit';
