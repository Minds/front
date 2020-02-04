import { Component, ComponentFactoryResolver, ViewChild } from '@angular/core';

import { Storage } from '../../../services/storage';
import { Sidebar } from '../../../services/ui/sidebar';
import { Session } from '../../../services/session';
import { DynamicHostDirective } from '../../directives/dynamic-host.directive';
import { NotificationsToasterComponent } from '../../../modules/notifications/toaster.component';
import { ConfigsService } from '../../services/configs.service';

@Component({
  moduleId: module.id,
  selector: 'm-topbar',
  templateUrl: 'topbar.component.html',
})
export class TopbarComponent {
  @ViewChild(DynamicHostDirective, { static: true }) host: DynamicHostDirective;

  readonly cdnAssetsUrl: string;

  componentRef;
  componentInstance: NotificationsToasterComponent;

  constructor(
    public session: Session,
    public storage: Storage,
    public sidebar: Sidebar,
    private _componentFactoryResolver: ComponentFactoryResolver,
    configs: ConfigsService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  ngAfterViewInit() {
    this.loadComponent();
  }

  /**
   * Open the navigation
   */
  openNav() {
    this.sidebar.open();
  }

  loadComponent() {
    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(
        NotificationsToasterComponent
      ),
      viewContainerRef = this.host.viewContainerRef;

    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentFactory);
    this.componentInstance = this.componentRef.instance;
  }
}
