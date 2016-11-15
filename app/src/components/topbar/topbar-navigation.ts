import { Component, EventEmitter } from '@angular/core';

import { Navigation as NavigationService } from '../../services/navigation';
import { SessionFactory } from '../../services/session';

@Component({
  selector: 'minds-topbar-navigation',
  template: `
    <nav class="" *ngIf="session.isLoggedIn()">

    	<a *ngFor="let item of navigation.getItems('topbar')" class="mdl-color-text--blue-grey-500"
    		[routerLink]="[item.path, item.params]"
    		>
    		<i class="material-icons" [ngClass]="{'mdl-color-text--amber-300' : item.extras?.counter > 0 && item.name == 'Notifications'}">{{item.icon}}</i>
        <span id="{{item.name | lowercase}}-counter" class="counter mdl-color-text--green-400" *ngIf="item.extras">{{item.extras?.counter | abbr}}</span>
    	</a>

    </nav>
  `
})

export class TopbarNavigation {

	user;
	session = SessionFactory.build();

	constructor(public navigation : NavigationService){
		var self = this;
	}

}
