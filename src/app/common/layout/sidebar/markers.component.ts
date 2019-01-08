import { Component, ComponentFactoryResolver, ViewChild } from '@angular/core';

import { Storage } from '../../../services/storage';
import { Sidebar } from '../../../services/ui/sidebar';
import { NotificationService } from '../../../modules/notifications/notification.service';
import { Session } from '../../../services/session';
import { DynamicHostDirective } from '../../directives/dynamic-host.directive';
import { GroupsSidebarMarkersComponent } from '../../../modules/groups/sidebar-markers/sidebar-markers.component';

@Component({
  selector: 'm-sidebar--markers',
  templateUrl: 'markers.component.html'
})

export class SidebarMarkersComponent {

  @ViewChild(DynamicHostDirective) host: DynamicHostDirective;

  minds = window.Minds;

  componentRef;
  componentInstance: GroupsSidebarMarkersComponent;

  constructor(
    public session: Session,
    public storage: Storage,
    public sidebar: Sidebar,
    private _componentFactoryResolver: ComponentFactoryResolver,
  ) {
  }

  ngAfterViewInit() {
    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(GroupsSidebarMarkersComponent),
      viewContainerRef = this.host.viewContainerRef;

    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentFactory);
    this.componentInstance = this.componentRef.instance;
  }

}
