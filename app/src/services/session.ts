/**
 * Sesions
 */
import { EventEmitter, Injector, provide } from 'angular2/core';

export class Session {
	loggedinEmitter : EventEmitter<any> = new EventEmitter();
	userEmitter : EventEmitter<any> = new EventEmitter();

	/**
	 * Return if loggedin, with an optional listener
	 */
	isLoggedIn(observe: any = null){

		if(observe){
			this.loggedinEmitter.subscribe({next: (is) => {
				if(is)
					observe(true);
				else
					observe(false);
				}
			});
		}

		if(window.Minds.LoggedIn)
			return true;

		return false
	}

	isAdmin(){
		if(!this.isLoggedIn)
			return false;
		if(window.Minds.Admin)
			return true;

		return false;
	}

	/**
	 * Get the loggedin user
	 */
	getLoggedInUser(observe: any = null){

		if(observe){
			this.userEmitter.subscribe({next: (user) => {
				observe(user);
			}});
		}

		if(window.Minds.user)
			return window.Minds.user;

		return false;
	}

	/**
	 * Emit login event
	 */
	login(user : any = null){
		//clear stale local storage
		window.localStorage.clear();
		this.userEmitter.next(user);
		window.Minds.user = user;
		window.Minds.LoggedIn = true;
		this.loggedinEmitter.next(true);
	}

	/**
	 * Emit logout event
	 */
	logout(){
		this.userEmitter.next(null);
		delete window.Minds.user;
		window.Minds.LoggedIn = false;
		window.localStorage.clear();
		this.loggedinEmitter.next(false);
	}

}

var injector = Injector.resolveAndCreate([
	provide(Session, { useFactory: () => new Session() })
]);

export class SessionFactory {
	static build(){
		return injector.get(Session);
	}
}
