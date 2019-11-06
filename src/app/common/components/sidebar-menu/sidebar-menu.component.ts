import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Session } from '../../../services/session';
import sidebarMenus from './sidebar-menus.default';

interface Menu {
  header: MenuLink;
  links?: MenuLink[];
  expanded?: boolean;
}
export { Menu };

interface MenuLink {
  id: string;
  label: string;
  permissions?: string[];
  permissionGranted?: boolean;
  path?: string;
  newWindow?: boolean;
}
export { MenuLink };

@Component({
  selector: 'm-sidebarMenu',
  templateUrl: './sidebar-menu.component.html',
})
export class SidebarMenuComponent implements OnInit {
  @Input() menuId: string;

  menu: Menu;
  mobileMenuExpanded = false;
  minds: Minds;
  user;
  userRoles: string[] = ['user'];

  constructor(public route: ActivatedRoute, public session: Session) {}

  ngOnInit() {
    this.minds = window.Minds;
    this.user = this.session.getLoggedInUser();
    this.menu = sidebarMenus.find(menu => menu.header.id === this.menuId);
    this.getUserRoles();
    this.grantPermissionsAndFindActiveMenu();
  }

  getUserRoles() {
    if (this.session.isAdmin()) {
      this.userRoles.push('admin');
    }
    if (this.minds.user.pro) {
      this.userRoles.push('pro');
    }
  }

  grantPermissionsAndFindActiveMenu() {
    // this.menu.forEach(this.menu => {
    this.menu.header['permissionGranted'] = this.menu.header.permissions
      ? this.checkForRoleMatch(this.menu.header.permissions)
      : true;

    if (this.menu.links) {
      this.menu.links.forEach(link => {
        link['permissionGranted'] = link.permissions
          ? this.checkForRoleMatch(link.permissions)
          : true;

        if (link.id === ':user') {
          link.id = this.user.username;
        }
        if (link.path) {
          link.path = link.path.replace(':user', this.user.username);
        }
      });
    }

    // if (location.pathname.indexOf(this.menus.header.path) !== -1) {
    //   this.menus.header['expanded'] = true;
    //   this.activeMenu = this.menu;
    // } else {
    //   this.menu.header['expanded'] = false;
    // }
    // });
  }

  checkForRoleMatch(permissionsArray) {
    return permissionsArray.some(role => this.userRoles.includes(role));
  }
}
