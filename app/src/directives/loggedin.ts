import { Component } from 'angular2/core';
import { Storage } from '../services/storage';

@Component({
  selector: 'minds-loggedin',
  viewBindings: [Storage]
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
