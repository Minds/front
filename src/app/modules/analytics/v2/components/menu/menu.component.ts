import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Session } from '../../../../../services/session';
import menuCategories from '../../categories.default';

interface MenuCategory {
  category: MenuLink;
  subcategories: MenuLink[];
  expanded?: boolean;
}
export { MenuCategory };

interface MenuLink {
  id: string;
  label: string;
  permissions?: string[];
}
export { MenuLink };

@Component({
  selector: 'm-analytics__menu',
  templateUrl: './menu.component.html',
})
export class AnalyticsMenuComponent implements OnInit {
  cats: MenuCategory[] = menuCategories;
  menuExpanded: boolean = false;
  minds;
  user;

  constructor(public route: ActivatedRoute, public session: Session) {}

  ngOnInit() {
    this.minds = window.Minds;
    this.user = this.session.getLoggedInUser();
  }
}
