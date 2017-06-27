import { Component, EventEmitter} from '@angular/core';

import { Client } from '../../../services/api';
import { NotificationService } from '../../../services/notification';
import { MindsWalletResponse } from '../../../interfaces/responses';
import { MindsUserSearchResponse } from '../../../interfaces/responses';
import { MindsBoostResponse } from '../../../interfaces/responses';
import { MindsBoostRateResponse } from '../../../interfaces/responses';

@Component({
  moduleId: module.id,
  selector: 'minds-boost',
  inputs: ['object'],
  outputs: ['_done: done'],
  templateUrl: 'boost.component.html'
})

export class BoostComponent {

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
