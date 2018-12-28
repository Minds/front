import { Component, EventEmitter } from '@angular/core';

import { Navigation as NavigationService } from '../../../services/navigation';
import { Session } from '../../../services/session';
import { UpdateMarkersService } from '../../services/update-markers.service';

@Component({
	selector: 'm-topbar--navigation',
	templateUrl: 'navigation.component.html'
})

export class TopbarNavigationComponent {

	user;
	items;
    hasMarker = false;

	constructor(
		public navigation: NavigationService,
        public session: Session,
        private updateMarkers: UpdateMarkersService,
	) {
    }

    ngOnInit() {
        this.items = this.navigation.getItems('topbar');
		this.getUser();
        this.updateMarkers.markers.subscribe(markers => {
          if (!markers)
            return;
          this.hasMarker = markers
            .filter(marker => marker.read_timestamp < marker.updated_timestamp)
            .length;
        });
    }

	getUser() {
		this.user = this.session.getLoggedInUser((user) => {
			this.user = user;
		});
	}

}
