import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Session } from '../../../services/session';
import { ConfigsService } from '../../services/configs.service';

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
  @Input() menu: Menu;

  mobileMenuExpanded = false;
  readonly cdnUrl: string;
  user;
  userRoles: string[] = ['user'];

  constructor(
    public route: ActivatedRoute,
    public session: Session,
    configs: ConfigsService
  ) {
    this.cdnUrl = configs.get('cdn_url');
  }

  ngOnInit() {
    this.user = this.session.getLoggedInUser();
    this.getUserRoles();
    this.grantPermissions();
  }

  getUserRoles() {
    if (this.session.isAdmin()) {
      this.userRoles.push('admin');
    }
    if (this.user.pro) {
      this.userRoles.push('pro');
    }
  }

  grantPermissions() {
    this.menu.header['permissionGranted'] = this.menu.header.permissions
      ? this.checkForRoleMatch(this.menu.header.permissions)
      : true;

    if (this.menu.links) {
      this.menu.links.forEach(link => {
        link['permissionGranted'] = link.permissions
          ? this.checkForRoleMatch(link.permissions)
          : true;

        if (link.id === ':username') {
          link.id = this.user.username;
        }
        if (link.path) {
          link.path = link.path.replace(':username', this.user.username);
        }
      });
    }
  }

  checkForRoleMatch(permissionsArray) {
    return permissionsArray.some(role => this.userRoles.includes(role));
  }
}
