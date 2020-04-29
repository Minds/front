import {
  Component,
  ComponentFactoryResolver,
  ViewChild,
  HostListener,
  AfterViewInit,
} from '@angular/core';

import { Storage } from '../../../services/storage';
import { Sidebar } from '../../../services/ui/sidebar';
import { Session } from '../../../services/session';
import { DynamicHostDirective } from '../../directives/dynamic-host.directive';
import { GroupsSidebarMarkersComponent } from '../../../modules/groups/sidebar-markers/sidebar-markers.component';
import { SidebarMarkersService } from './markers.service';

@Component({
  selector: 'm-sidebar--markers',
  templateUrl: 'markers.component.html',
})
export class SidebarMarkersComponent implements AfterViewInit {
  @ViewChild(DynamicHostDirective, { static: true }) host: DynamicHostDirective;

  showMarkerSidebar = false;

  componentRef;
  componentInstance: GroupsSidebarMarkersComponent;

  visible: boolean = true;

  constructor(
    public session: Session,
    public storage: Storage,
    public sidebar: Sidebar,
    private sidebarMarkersService: SidebarMarkersService,
    private _componentFactoryResolver: ComponentFactoryResolver
  ) {
    this.sidebarMarkersService.setContainer(this);
  }

  ngAfterViewInit() {
    const isLoggedIn = this.session.isLoggedIn((is: boolean) => {
      // recheck on session status change
      this.checkSidebarVisibility(is);
    });
    // check now
    this.checkSidebarVisibility(isLoggedIn);
  }

  checkSidebarVisibility(isLoggedIn) {
    const showMarkerSidebar = isLoggedIn /*&& window.innerWidth >= 900*/;

    if (showMarkerSidebar === this.showMarkerSidebar) {
      return;
    }

    if (showMarkerSidebar) {
      this.createGroupsSideBar();
    } else {
      this.host.viewContainerRef.clear();
    }
    this.showMarkerSidebar = showMarkerSidebar;
  }

  // @HostListener('window:resize') detectWidth() {
  //   this.checkSidebarVisibility(this.session.isLoggedIn());
  // }

  createGroupsSideBar() {
    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(
        GroupsSidebarMarkersComponent
      ),
      viewContainerRef = this.host.viewContainerRef;

    this.componentRef = viewContainerRef.createComponent(componentFactory);
    this.componentInstance = this.componentRef.instance;
  }
}
