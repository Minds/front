import { Component, View, Inject } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { Router, RouteParams, RouterLink } from 'angular2/router';

import { MindsTitle } from '../../services/ux/title';
import { Client } from '../../services/api';
import { Material } from '../../directives/material';
import { SessionFactory } from '../../services/session';
import { InfiniteScroll } from '../../directives/infinite-scroll';
import { CARDS } from '../../controllers/cards/cards';
import { BUTTON_COMPONENTS } from '../../components/buttons';


@Component({
  selector: 'minds-discovery',
  viewBindings: [ Client ],
  bindings: [ MindsTitle ]
})
@View({
  templateUrl: 'src/controllers/discovery/discovery.html',
  directives: [ CORE_DIRECTIVES, RouterLink, Material, InfiniteScroll, CARDS, BUTTON_COMPONENTS ]
})

export class Discovery {

  session  = SessionFactory.build();

  _filter : string = "featured";
  _owner : string = "";
  _type : string = "all";
  entities : Array<Object> = [];
  moreData : boolean = true;
  offset: string | number = "";
  inProgress : boolean = false;

  city : string = "";
  cities : Array<any> = [];
  nearby : boolean = false;
  hasNearby : boolean = false;
  distance : number = 5;

  constructor(public client: Client, public router: Router, public params: RouteParams, public title: MindsTitle){
    this._filter = params.params['filter'];

    switch(this._filter){
      case "all":
        break;
      case "suggested":
        if(!this.session.isLoggedIn()){
          this.router.navigate(['/Discovery', {'filter': 'featured', 'type': 'channels'}]);
          return;
        }

        this._type = "channels";
        if(this.session.getLoggedInUser().city){
          this.city = this.session.getLoggedInUser().city;
          this.nearby = true;
          this.hasNearby = false;
        }
        break;
      case "trending":
        this._type = "images";
        break;
      case "featured":
        this._type = "channels";
        break;
      case "owner":
        break;
      default:
        this._owner = this._filter;
        this._filter =  this._filter;
    }

    if(params.params['type'])
      this._type = params.params['type'];

    this.title.setTitle("Discovery");

    this.load(true);
  }

  load(refresh : boolean = false){

    if(this.inProgress)
      return false;

    if(refresh)
      this.offset = "";

    this.inProgress = true;

    var filter = this._filter;
    if(this._owner)
      filter = 'owner';

    this.client.get('api/v1/entities/'+filter+'/'+this._type+'/' + this._owner, {
        limit:12,
        offset: this.offset,
        skip: 0,
        nearby : this.nearby,
        distance : this.distance
      })
      .then((data : any) => {
        if(!data.entities){
          if(this.nearby){
            this.hasNearby = false;
            return this.setNearby(false);
          }
          this.moreData = false;
          this.inProgress = false;
          return false;
        }

        if(this.nearby){
          this.hasNearby = true;
        }

        if(refresh){
          this.entities = data.entities;
        }else{
          if(this.offset)
            this.entities.shift();
          this.entities = this.entities.concat(data.entities);
        }

        this.offset = data['load-next'];
        this.inProgress = false;

       })
       .catch((e) => {
         this.inProgress = false;
         if(this.nearby){
           this.setNearby(false);
         }
       });
  }

  pass(index : number){
    var entity : any = this.entities[index];
    this.client.post('api/v1/entities/suggested/pass/' + entity.guid);
    this.pop(index);
  }

  pop(index : number){
    this.entities.splice(index, 1);
    if(this.entities.length < 3){
      this.offset = 3;
      this.load(true);
    }
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
    this.city = window.Minds.user.city;
    this.entities = [];
    this.inProgress = true;
    this.client.post('api/v1/channel/info', {
        coordinates : row.lat + ',' + row.lon,
        city : window.Minds.user.city
      })
      .then((response : any) => {
        this.inProgress = false;
        this.setNearby(true);
      });
  }

  setNearby(nearby : boolean){
    this.nearby  = nearby;
    this.entities = [];
    this.load(true);
  }

}
