import {
  Component,
  ComponentFactoryResolver,
  HostBinding,
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
import { SidebarNavigationService } from './navigation.service';
import { ConfigsService } from '../../services/configs.service';

@Component({
  selector: 'm-sidebar--navigation',
  templateUrl: 'navigation.component.html',
})
export class SidebarNavigationComponent implements OnInit {
  readonly cdnAssetsUrl: string;

  @ViewChild(DynamicHostDirective, { static: true }) host: DynamicHostDirective;

  user;

  componentRef;
  componentInstance: GroupsSidebarMarkersComponent;

  layoutMode: 'phone' | 'tablet' | 'desktop' = 'desktop';

  @HostBinding('class.m-sidebarNavigation--opened')
  isOpened: boolean = false;

  constructor(
    public navigation: NavigationService,
    public session: Session,
    private service: SidebarNavigationService,
    protected configs: ConfigsService,
    private _componentFactoryResolver: ComponentFactoryResolver,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.cdnAssetsUrl = this.configs.get('cdn_assets_url');
    this.service.setContainer(this);
    this.getUser();
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.onResize();
    }

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
    this.componentInstance.leftSidebar = true;
  }

  toggle(): void {
    if (this.layoutMode === 'phone') {
      this.isOpened = !this.isOpened;
    }
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth > 900) {
      this.layoutMode = 'desktop';
    } else if (window.innerWidth > 540 && window.innerWidth <= 900) {
      this.layoutMode = 'tablet';
    } else {
      this.layoutMode = 'phone';
    }

    if (this.layoutMode !== 'phone') {
      this.isOpened = false;
    }
  }
}
