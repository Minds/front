import { Component, EventEmitter } from '@angular/core';
import { CORE_DIRECTIVES } from '@angular/common';
import { RouterLink } from '@angular/router-deprecated';

import { Navigation as NavigationService } from '../../services/navigation';
import { SessionFactory } from '../../services/session';
import { MINDS_PIPES } from '../../pipes/pipes';


@Component({
  selector: 'minds-topbar-navigation',
  viewProviders: [NavigationService ],
  template: `
    <nav class="" *ngIf="session.isLoggedIn()">

    	<a *ngFor="let item of navigation.getItems('topbar')" class="mdl-color-text--blue-grey-500"
    		[routerLink]="[item.path, item.params]"
    		>
    		<i class="material-icons" [ngClass]="{'mdl-color-text--amber-300' : item.extras?.counter > 0 && item.name == 'Notifications'}">{{item.icon}}</i>
        <span id="{{item.name | lowercase}}-counter" class="counter mdl-color-text--green-400" *ngIf="item.extras">{{item.extras?.counter | abbr}}</span>
    	</a>

    </nav>
  `,
  directives: [RouterLink, CORE_DIRECTIVES],
  pipes: [MINDS_PIPES]
})

export class TopbarNavigation {

	user;
	session = SessionFactory.build();

	constructor(public navigation : NavigationService){
		var self = this;
	}

}
