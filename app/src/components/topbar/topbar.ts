import { Component, View, CORE_DIRECTIVES } from 'angular2/angular2';
import { RouterLink } from 'angular2/router';
import { Material } from '../../directives/material';
import { Storage } from '../../services/storage';
import { Sidebar } from '../../services/ui/sidebar';
import { SessionFactory } from '../../services/session';
import { SearchBar } from '../../controllers/search/bar';
import { TopbarNavigation } from './topbar-navigation';

@Component({
  selector: 'minds-topbar',
  viewBindings: [ Storage, Sidebar ]
})
@View({
  templateUrl: 'src/components/topbar/topbar.html',
  directives: [ CORE_DIRECTIVES, RouterLink, Material, SearchBar, TopbarNavigation ]
})

export class Topbar{

	session = SessionFactory.build();

	constructor(public storage: Storage, public sidebar : Sidebar){
	}

	/**
	 * Open the navigation
	 */
	openNav(){
		this.sidebar.open();
	}
}
