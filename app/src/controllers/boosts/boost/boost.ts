import { Component, View, EventEmitter} from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { RouterLink } from "angular2/router";

import { Client } from '../../../services/api';
import { NotificationService } from '../../../services/notification';
import { Material } from '../../../directives/material';
import { MindsWalletResponse } from '../../../interfaces/responses';
import { MindsUserSearchResponse } from '../../../interfaces/responses';
import { MindsBoostResponse } from '../../../interfaces/responses';
import { MindsBoostRateResponse } from '../../../interfaces/responses';
import { BoostFullNetwork } from './full-network/full-network';
import { BoostP2P} from './p2p/p2p';

@Component({
  selector: 'minds-boost',
  viewBindings: [ Client, NotificationService ],
  properties: ['object'],
  events: ['_done: done']
})
@View({
  templateUrl: 'src/controllers/boosts/boost/boost.html',
  directives: [ CORE_DIRECTIVES, Material, RouterLink, BoostFullNetwork, BoostP2P]
})

export class Boost{

  minds : Minds;
  activity : any;
  type : string = '';
  _done: EventEmitter<any> = new EventEmitter();

  constructor(public client: Client, public notificationService : NotificationService){
    this.minds = window.Minds;
  }

  set object(value: any) {
    this.activity = value;
  }

  done(){
    this.type = '';
    this._done.next(true);
    this.notificationService.increment();
  }

}
