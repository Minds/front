import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Session } from '../../../services/session';
import sidebarMenuCategories from './sidebar-menu-categories.default';

interface MenuCategory {
  header: MenuLink;
  links?: MenuLink[];
  expanded?: boolean;
}
export { MenuCategory };

interface MenuLink {
  id: string;
  label: string;
  permissions?: string[];
  permissionGranted?: boolean;
  path?: string;
}
export { MenuLink };

@Component({
  selector: 'm-sidebarMenu',
  templateUrl: './sidebar-menu.component.html',
})
export class SidebarMenuComponent implements OnInit {
  @Input() catId: string;

  cat: MenuCategory;
  mobileMenuExpanded = false;
  // activeCat;
  minds: Minds;
  user;
  userRoles: string[] = ['user'];

  constructor(public route: ActivatedRoute, public session: Session) {}

  ngOnInit() {
    this.minds = window.Minds;
    this.user = this.session.getLoggedInUser();
    this.cat = sidebarMenuCategories.find(cat => cat.header.id === this.catId);
    this.getUserRoles();
    this.grantPermissionsAndFindActiveCat();
  }

  getUserRoles() {
    if (this.session.isAdmin()) {
      this.userRoles.push('admin');
    }
    // TODO: define & handle other userRole options, e.g. pro, loggedIn
  }

  grantPermissionsAndFindActiveCat() {
    // this.cat.forEach(this.cat => {
    this.cat.header['permissionGranted'] = this.cat.header.permissions
      ? this.checkForRoleMatch(this.cat.header.permissions)
      : true;

    if (this.cat.links) {
      this.cat.links.forEach(link => {
        link['permissionGranted'] = link.permissions
          ? this.checkForRoleMatch(link.permissions)
          : true;
      });
    }
    // if (location.pathname.indexOf(this.cats.header.path) !== -1) {
    //   this.cats.header['expanded'] = true;
    //   this.activeCat = this.cat;
    // } else {
    //   this.cat.header['expanded'] = false;
    // }
    // });
  }

  checkForRoleMatch(permissionsArray) {
    return permissionsArray.some(role => this.userRoles.includes(role));
  }
}
