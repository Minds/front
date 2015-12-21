import { Component, View, CORE_DIRECTIVES, EventEmitter } from 'angular2/angular2';
import { RouterLink } from 'angular2/router';
import { Navigation as NavigationService } from '../../services/navigation';
import { SessionFactory } from '../../services/session';
import { MINDS_PIPES } from '../../pipes/pipes';


@Component({
  selector: 'minds-topbar-navigation',
  viewBindings: [ NavigationService ]
})
@View({
  template: `
    <nav class="" *ng-if="session.isLoggedIn()">

    	<a *ng-for="#item of navigation.getItems('topbar')" class="mdl-color-text--blue-grey-500"
    		[router-link]="[item.path, item.params]"
    		>
    		<i class="material-icons" [ng-class]="{'mdl-color-text--amber-300' : item.extras?.counter > 0 && item.name == 'Notifications'}">{{item.icon}}</i>
        <span id="{{item.name | lowercase}}-counter" class="counter mdl-color-text--green-400" *ng-if="item.extras">{{item.extras?.counter | abbr}}</span>
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
