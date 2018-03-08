import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Navigation as NavigationService } from '../../../services/navigation';
import { Session } from '../../../services/session';

@Component({
	selector: 'm-topbar--navigation--options',
	templateUrl: 'options.component.html'
})

export class TopbarOptionsComponent {

	@Input() options: Array<string> = [ 'rating' ];
	@Output() change: EventEmitter<{ rating }> = new EventEmitter;

	constructor(public session: Session) {
	}

	get rating() {
		return this.session.getLoggedInUser().boost_rating;
  }
  
  toggleRating() {
		switch (this.rating) {
			case 1:
				this.session.getLoggedInUser().boost_rating = 2;
				break;
			case 2:
			default:
				this.session.getLoggedInUser().boost_rating = 1;
				break;
		}
		this.change.next({ rating: this.rating });
  }

}
