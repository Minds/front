import {
  Component,
  ComponentFactoryResolver,
  HostListener,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Navigation as NavigationService } from '../../../services/navigation';
import { Session } from '../../../services/session';
import { GroupsSidebarMarkersComponent } from '../../../modules/groups/sidebar-markers/sidebar-markers.component';
import { DynamicHostDirective } from '../../directives/dynamic-host.directive';

@Component({
  selector: 'm-sidebar--navigation',
  templateUrl: 'navigation.component.html',
})
export class SidebarNavigationComponent implements OnInit {
  @ViewChild(DynamicHostDirective, { static: true }) host: DynamicHostDirective;

  user;

  componentRef;
  componentInstance: GroupsSidebarMarkersComponent;

  isDesktop: boolean = true;

  constructor(
    public navigation: NavigationService,
    public session: Session,
    private _componentFactoryResolver: ComponentFactoryResolver,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.getUser();

    if (isPlatformBrowser(this.platformId)) {
      this.onResize();
    }
  }

  ngOnInit() {
    this.createGroupsSideBar();
  }

  getUser() {
    this.user = this.session.getLoggedInUser(user => {
      this.user = user;
    });
  }

  createGroupsSideBar() {
    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(
        GroupsSidebarMarkersComponent
      ),
      viewContainerRef = this.host.viewContainerRef;

    this.componentRef = viewContainerRef.createComponent(componentFactory);
    this.componentInstance = this.componentRef.instance;
    this.componentInstance.showLabels = true;
  }

  @HostListener('window:resize')
  onResize() {
    this.isDesktop = window.innerWidth > 900;
  }
}
