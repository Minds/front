import { Component, View, CORE_DIRECTIVES, FORM_DIRECTIVES, EventEmitter} from 'angular2/angular2';
import { RouterLink } from "angular2/router";
import { Client } from '../../../../services/api';
import { Material } from '../../../../directives/material';
import { WalletService } from '../../../../services/wallet';
import { MindsWalletResponse } from '../../../../interfaces/responses';
import { MindsUserSearchResponse } from '../../../../interfaces/responses';
import { MindsBoostResponse } from '../../../../interfaces/responses';
import { MindsBoostRateResponse } from '../../../../interfaces/responses';

@Component({
  selector: 'minds-boost-full-network',
  viewBindings: [ Client ],
  properties: ['object'],
  events: ['_done: done']
})
@View({
  templateUrl: 'src/controllers/boosts/boost/full-network/full-network.html',
  directives: [ FORM_DIRECTIVES, CORE_DIRECTIVES, Material, RouterLink]
})

export class BoostFullNetwork{

  _done: EventEmitter<any> = new EventEmitter();

  activity : any;
  data = {
    destination: '',
    points: 0,
    impressions: 0
  };
  rate : any = {
    balance: 0,
    rate: 1,
    min: 10,
    cap: 1000
  }

  inProgress : boolean = false;
  error : string = "";

  constructor(public client: Client, public wallet: WalletService){
    //get the rates and balance
    this.client.get('api/v1/boost/rates', { cb: Date.now() })
      .then((success : MindsBoostRateResponse) => {
        this.rate = success;
      });
  }

  set object(value: any) {
    this.activity = value;
  }

  boost() {

    if(this.inProgress)
      return;
    this.inProgress = true;
    this.error = "";

    if (this.data.points % 1 !== 0) {
      this.data.points = Math.round(this.data.points);
      this.error = 'Sorry, you must enter a whole point.';
      this.inProgress = false;
      return false;
    }

    if (this.data.points === 0 || !this.data.points) {
      this.data.points = 1;
      this.error ='Sorry, you must enter a whole point.';
      this.inProgress = false;
      return false;
    }

    if (this.data.impressions === 0 || Math.round(this.data.impressions) === 0) {
      this.error = 'Sorry, you must have at least 1 impression.';
      this.inProgress = false;
      return false;
    }

    if (!this.checkBalance())
      return false;

    //commence the boost
    this.client.post( 'api/v1/boost/newsfeed/' + this.activity.guid + '/' + this.activity.owner_guid,
      {
        impressions: this.data.impressions,
        destination: this.data.destination
      })
      .then((success : MindsBoostResponse) => {
        this.inProgress = false;
        this.wallet.decrement(this.data.points);

        //?
        this._done.next(true);
      })
      .catch((e) => {
        this.error = 'Sorry, something went wrong.';
        this.inProgress = false;
      });

  }

  handleErrorMessage(message : string){
    this.error = message;
    this.inProgress = false;
  }

  checkBalance(){
    if (this.rate.balance < this.data.points) {
      this.handleErrorMessage('Ooops! You don\'t have enough points');
      return false;
    }

    //over the cap?
    if (this.data.points > this.rate.cap) {
      this.handleErrorMessage('Ooops! Sorry, there is a limit on how many points can be spent.');
      return false;
    }

    //under the min?
    if (this.data.points < this.rate.min) {
      this.handleErrorMessage('Ooops! Sorry, you need to enter at least ' + this.rate.min + ' points');
      return false;
    }
    //check if the user has enough points
    if (this.rate.balance >= this.data.points){
      return true;
    }

    return false;
  }

  calculateImpressions(){
    this.data.impressions = Math.round(this.data.points * this.rate.rate);
  }

  calculatePoints(){
    this.data.points = Math.round(this.data.impressions / this.rate.rate);
  }

  close(){
    this._done.next(true);
  }

}
