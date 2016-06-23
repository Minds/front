import { Component } from '@angular/core';
import { Storage } from '../services/storage';

@Component({
  selector: 'minds-loggedin',
  viewProviders: [Storage]
})

export class LoggedIn {
	constructor(public storage: Storage){

	}
	isLoggedIn(){
		console.log('checking ng-if');
		if(this.storage.get('loggedin'))
			return true;
		return false;
	}
}
