import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Session } from '../../../services/session';
import menuCategories from './categories.default';

interface MenuCategory {
  category: MenuLink;
  subcategories?: MenuLink[];
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
  cats: MenuCategory[] = menuCategories;
  mobileMenuExpanded = false;
  activeCat;
  minds: Minds;
  user;
  userRoles: string[] = ['user'];

  constructor(public route: ActivatedRoute, public session: Session) {}

  ngOnInit() {
    this.minds = window.Minds;
    this.user = this.session.getLoggedInUser();
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
    this.cats.forEach(catObj => {
      catObj.category['permissionGranted'] = catObj.category.permissions
        ? this.checkForRoleMatch(catObj.category.permissions)
        : true;

      if (catObj.subcategories) {
        catObj.subcategories.forEach(subCat => {
          subCat['permissionGranted'] = subCat.permissions
            ? this.checkForRoleMatch(subCat.permissions)
            : true;
        });
      }
      if (location.pathname.indexOf(catObj.category.path) !== -1) {
        catObj.category['expanded'] = true;
        this.activeCat = catObj;
      } else {
        catObj.category['expanded'] = false;
      }
    });
  }

  checkForRoleMatch(permissionsArray) {
    return permissionsArray.some(role => this.userRoles.includes(role));
  }
}
