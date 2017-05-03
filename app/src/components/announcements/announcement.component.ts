import { Component, EventEmitter } from '@angular/core';

import { Client } from '../../services/api';
import { Material } from '../../directives/material';

@Component({
  selector: 'm-announcement',
  host: {
    '[hidden]': 'hidden'
  },
  template: `
    <div class="m-announcement">


      <div class="m-announcement--content">
        <ng-content></ng-content>
      </div>

      <div class="m-announcement--close" (click)="close()">
        <i class="material-icons">close</i>
      </div>

    </div>
  `
})

export class AnnouncementComponent{

  minds : Minds = window.Minds;
  hidden : boolean = false;

	constructor(){
	}

  close(){
    this.hidden = true;
  }


}
