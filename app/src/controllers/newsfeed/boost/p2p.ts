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
  templateUrl: 'templates/newsfeed/boost/p2p.html',
  directives: [ FORM_DIRECTIVES, CORE_DIRECTIVES, Material, RouterLink, Checkout]
})

export class BoostP2P{

  _done: EventEmitter = new EventEmitter();
  minds : Minds = window.Minds;

  activity : any;
  errorMessage : string = "";

  destination; //the user object
  points : number = 0;
  usd : number;
  pro: boolean = false;
  option : string;

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
    this.errorMessage = "";

    if (this.points % 1 !== 0) {
      this.points = Math.round(this.points);
      this.errorMessage = 'Sorry, you must enter a whole point.';
      this.inProgress = false;
      return false;
    }

    if (this.points === 0 || !this.points) {
      this.points = 1;
      this.errorMessage ='Sorry, you must enter a whole point.';
      this.inProgress = false;
      return false;
    }

    if (this.destination === '' && (this.impressions === 0 || Math.round(this.impressions) === 0)) {
      this.errorMessage = 'Sorry, you must have at least 1 impression.';
      this.inProgress = false;
      return false;
    }

    if (this.checkBalance() && this.destination){

      this.client.post('api/v1/boost/channel/' + this.activity.guid + '/' + this.activity.owner_guid, {
          impressions: this.points,
          destination: this.data.destination.charAt(0) == '@' ? this.data.destination.substr(1) : this.data.destination
        })
        .then((success : MindsBoostResponse) => {
          self.inProgress = false;
          if (success.status == 'success') {
            return true;
          } else {
            return false;
          }

        })
        .catch((e) => {
          self.handleErrorMessage('Sorry, something went wrong.');
          return false;
        });

    } else {
      this.inProgress = false;
    }
  }

  checkBalance(){
    if (this.rate.balance < this.points) {
      this.handleErrorMessage('Ooops! You don\'t have enough points');
      this.notEnoughPoints = true;
      return false;
    }

    //check if the user has enough points
    if (this.rate.balance >= this.points){
      return true;
    }
  }

  handleErrorMessage(message : string){
    this.errorMessage = message;
    this.inProgress = false;
  }

  //for Channel Boost
  search(q) {
    this.searching = true;
    if (this.q.charAt(0) != '@') {
      this.q = '@' + this.q;
    }

    var query = this.q;
    if (query.charAt(0) == '@') {
      query = query.substr(1);
    }

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
