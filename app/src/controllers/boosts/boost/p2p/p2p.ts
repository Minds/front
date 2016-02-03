import { Component, View, EventEmitter, NgZone} from 'angular2/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from 'angular2/common';
import { RouterLink } from "angular2/router";

import { Client } from '../../../../services/api';
import { Material } from '../../../../directives/material';

import { Checkout } from '../../../payments/checkout';

import { Scheduler } from '../../../../components/scheduler/scheduler';

import { MindsWalletResponse } from '../../../../interfaces/responses';
import { MindsUserSearchResponse } from '../../../../interfaces/responses';
import { MindsBoostResponse } from '../../../../interfaces/responses';
import { MindsBoostRateResponse } from '../../../../interfaces/responses';


@Component({
  selector: 'minds-boost-p2p',
  providers: [  ],
  inputs: ['activity: object'],
  outputs: ['_done: done'],
  templateUrl: 'src/controllers/boosts/boost/p2p/p2p.html',
  directives: [ FORM_DIRECTIVES, CORE_DIRECTIVES, Material, RouterLink, Checkout, Scheduler]
})

export class BoostP2P{

  _done: EventEmitter<any> = new EventEmitter();
  minds : Minds = window.Minds;

  activity : any;
  error : string = "";

  destination; //the user object
  points : number = 0;
  bid: number;
  pro: boolean = false;
  option : string;
  stage : number = 1;
  complete : boolean = false;

  canPostToFacebook : boolean = false;
  postToFacebook : boolean = false;
  scheduledTs : Number;

  searching: boolean = false;
  q : string = '';
  results : Array<any> = [];

  inProgress : boolean = false;
  notEnoughPoints : boolean = false;
  rate : MindsBoostRateResponse;

  constructor(public client: Client, public nz: NgZone){
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

  boost(nonce){

    if(this.inProgress)
      return;
    this.inProgress = true;

    this.nz.run(() => {
      this.error = '';
      this.stage = 3;
    });

    if(this.option == 'points' && !this.checkBalance()){
      this.inProgress = false;
      return true;
    }

    this.client.post('api/v1/boost/peer/' + this.activity.guid + '/' + this.activity.owner_guid, {
        type: this.option,
        bid: this.bid,
        destination: this.destination.guid,
        scheduledTs: this.scheduledTs,
        postToFacebook: this.postToFacebook,
        nonce: nonce
      })
      .then((success : any) => {

        this.stage = 4;
        setTimeout(() => {
          this.inProgress = false;
          this._done.next(true);
          this.stage = 1;
        },1000);

      })
      .catch((e) => {
        this.inProgress = false;
        this.nz.run(() => {
          this.stage = 2;
          if(e.stage == 'transaction')
            this.error = "Sorry, your payment failed. Please try again or use another card"
          else
            this.error = e.message;
        });
      });
  }

  checkBalance(){
    if (this.rate.balance < this.bid) {
      this.error = 'Ooops! You don\'t have enough points';
      this.notEnoughPoints = true;
      return false;
    }

    //check if the user has enough points
    if (this.rate.balance >= this.bid){
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
    this.canPostToFacebook = user.boostProPlus;
    this.q = '';
    if(!this.pro)
      this.option = 'points';
  }

  close(){
    this._done.next(true);
  }

}
