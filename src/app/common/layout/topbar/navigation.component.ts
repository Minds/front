import { Component, EventEmitter } from '@angular/core';
import { map } from 'rxjs/operators';

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
    hasMarker$;

	constructor(
		public navigation: NavigationService,
        public session: Session,
        private updateMarkers: UpdateMarkersService,
	) {
    }

    ngOnInit() {
        this.items = this.navigation.getItems('topbar');
		this.getUser();
        /*this.hasMarker$ = this.updateMarkers.markers
          .pipe(
            map((markers: any) => {
              if (!markers)
                return;
              return markers
                .filter(marker =>
                  marker.read_timestamp < marker.updated_timestamp
                  && marker.marker != 'gathering-heartbeat'
                )
                .length;
            })
            );*/
    }

	getUser() {
		this.user = this.session.getLoggedInUser((user) => {
			this.user = user;
		});
	}

}
