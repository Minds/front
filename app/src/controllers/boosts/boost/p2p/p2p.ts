import { Component, View, CORE_DIRECTIVES, FORM_DIRECTIVES, EventEmitter} from 'angular2/angular2';
import { RouterLink } from "angular2/router";
import { Client } from 'src/services/api';
import { Material } from 'src/directives/material';

import { Checkout } from 'src/controllers/payments/checkout';

import { MindsWalletResponse } from 'src/interfaces/responses';
import { MindsUserSearchResponse } from 'src/interfaces/responses';
import { MindsBoostResponse } from 'src/interfaces/responses';
import { MindsBoostRateResponse } from 'src/interfaces/responses';

@Component({
  selector: 'minds-boost-p2p',
  providers: [ Client ],
  inputs: ['activity: object'],
  outputs: ['_done: done']
})
@View({
  templateUrl: 'src/controllers/boosts/boost/p2p/p2p.html',
  directives: [ FORM_DIRECTIVES, CORE_DIRECTIVES, Material, RouterLink, Checkout]
})

export class BoostP2P{

  _done: EventEmitter = new EventEmitter();
  minds : Minds = window.Minds;

  activity : any;
  error : string = "";

  destination; //the user object
  points : number = 0;
  usd : number;
  pro: boolean = false;
  option : string;
  stage : number = 1;
  complete : boolean = false;

  searching: boolean = false;
  q : string = '';
  results : Array<any> = [];

  inProgress : boolean = false;
  notEnoughPoints : boolean = false;
  rate : MindsBoostRateResponse;

  constructor(public client: Client){
    this.getRates();
  }

  getRates(){
    this.client.get('api/v1/boost/rates', {
        cb: Date.now()
      })
      .then((success : MindsBoostRateResponse) => {
        this.rate = success;
      });
  }

  boost() {
    var self =  this;
    this.inProgress = true;
    this.notEnoughPoints = false;
    this.error = "";

    if (this.points % 1 !== 0) {
      this.points = Math.round(this.points);
      this.error = 'Sorry, you must enter a whole point.';
      this.inProgress = false;
      return false;
    }

    if (this.points === 0 || !this.points) {
      this.points = 1;
      this.error ='Sorry, you must enter a whole point.';
      this.inProgress = false;
      return false;
    }

    if (!this.checkBalance() || !this.destination){
      this.inProgress = false;
      return;
    }

    this.client.post('api/v1/boost/channel/' + this.activity.guid + '/' + this.activity.owner_guid, {
        impressions: this.points,
        destination: this.destination.guid
      })
      .then((success : MindsBoostResponse) => {
        this.inProgress = false;
        if (success.status == 'success') {
          this._done.next(true);
          return true;
        } else {
          return false;
        }

      })
      .catch((e) => {
        this.error = 'Sorry, something went wrong.';
        return false;
      });

  }

  boostPro(nonce){
    var self = this;
    this.stage = 3;

    this.client.post('api/v1/boost/pro/' + this.activity.guid + '/' + this.activity.owner_guid, {
        bid: this.usd,
        destination: this.destination.guid,
        nonce: nonce
      })
      .then((success : any) => {
        this.inProgress = false;
        this.stage = 4;
        setTimeout(() => {
          self._done.next(true);
        },1000);

      })
      .catch((e) => {
        this.stage = 1;
        this.error = e.message;
      });
  }

  checkBalance(){
    if (this.rate.balance < this.points) {
      this.error = 'Ooops! You don\'t have enough points';
      this.notEnoughPoints = true;
      return false;
    }

    //check if the user has enough points
    if (this.rate.balance >= this.points){
      return true;
    }
  }

  //for Channel Boost

  timeout;
  search(q) {
    if(this.timeout)
      clearTimeout(this.timeout);

    this.searching = true;
    if (this.q.charAt(0) != '@') {
      this.q = '@' + this.q;
    }

    var query = this.q;
    if (query.charAt(0) == '@') {
      query = query.substr(1);
    }

    this.timeout = setTimeout(() => {
      this.client.get('api/v1/search', {
          q: query,
          type: 'user',
          view: 'json',
          limit: 5
        })
        .then((success : MindsUserSearchResponse)=> {
          if (success.entities){
            this.results = success.entities;
          }
        })
        .catch((error)=>{
          console.log(error);
        });
    }, 600);
  };

  selectDestination(user) {
    this.searching = false;
    this.destination = user;
    this.pro = user.merchant;
    this.q = '';
    if(!this.pro)
      this.option = 'points';
  }

  close(){
    this._done.next(true);
  }

}
