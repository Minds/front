import {
  Component,
  ComponentFactoryResolver,
  ViewChild,
  HostListener,
} from '@angular/core';

import { Storage } from '../../../services/storage';
import { Sidebar } from '../../../services/ui/sidebar';
import { Session } from '../../../services/session';
import { DynamicHostDirective } from '../../directives/dynamic-host.directive';
import { GroupsSidebarMarkersComponent } from '../../../modules/groups/sidebar-markers/sidebar-markers.component';

@Component({
  selector: 'm-sidebar--markers',
  templateUrl: 'markers.component.html',
})
export class SidebarMarkersComponent {
  @ViewChild(DynamicHostDirective, { static: true }) host: DynamicHostDirective;

  minds = window.Minds;
  showMarkerSidebar = false;

  componentRef;
  componentInstance: GroupsSidebarMarkersComponent;

  constructor(
    public session: Session,
    public storage: Storage,
    public sidebar: Sidebar,
    private _componentFactoryResolver: ComponentFactoryResolver
  ) {}

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

    const mBody: any = document.getElementsByTagName('m-body')[0];

    if (showMarkerSidebar) {
      mBody.classList.add('has-markers-sidebar');
      this.createGroupsSideBar();
    } else {
      mBody.classList.remove('has-markers-sidebar');
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
