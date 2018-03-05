import { Inject } from '@angular/core';
import { Location } from '@angular/common';

export class Navigation {

	static _(location: Location) {
		return new Navigation(location);
	}

	constructor(@Inject(Location) public location: Location) {
	}

	getItems(container: string = 'sidebar'): Array<any> {

		var navigation: Array<any> = window.Minds.navigation;
		var items: Array<any> = navigation[container];
		if (!items)
			return [];

		var path = this.location.path();
		for (var item of items) {
			let itemIndex = path.indexOf(item.path.toLowerCase());
			if (path === item.path || (path && itemIndex > -1 && itemIndex < 2)) {
				item.active = true;
				item.params = { ts: Date.now() };
			} else
				item.active = false;

			// a recursive function needs creating here
			// a bit messy and only allows 1 tier
			if (item.submenus) {
				for (var subitem of item.submenus) {
					var sub_path = subitem.path;
					for (var p in subitem.params) {
						if (subitem.params[p])
							sub_path += '/' + subitem.params[p];
					}

					if (path && path.indexOf(sub_path.toLowerCase()) > -1) {
						item.active = true; // activate parent aswell
						subitem.active = true;
						path += ';ts=' + Date.now();
					} else {
						subitem.active = false;
					}
				}
			}
		}
		return items;
	}

	setCounter(name: string, count: number = 1) {
		for (var i in window.Minds.navigation.sidebar) {
			var item = window.Minds.navigation.sidebar[i];
			if (item.name === 'Messenger' && this.location.path().indexOf(item.path.toLowerCase()) === -1) {
				item.extras.counter = count;
			}
		}
	}

}
