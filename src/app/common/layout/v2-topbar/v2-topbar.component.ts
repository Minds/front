import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild
} from "@angular/core";
import { Session } from "../../../services/session";
import { DynamicHostDirective } from "../../directives/dynamic-host.directive";
import { NotificationsToasterComponent } from "../../../modules/notifications/toaster.component";

@Component({
  selector: 'm-v2-topbar',
  templateUrl: 'v2-topbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class V2TopbarComponent implements OnInit {
  minds = window.Minds;

  @ViewChild(DynamicHostDirective) notificationsToasterHost: DynamicHostDirective;

  componentRef;
  componentInstance: NotificationsToasterComponent;

  constructor(
    protected session: Session,
    protected cd: ChangeDetectorRef,
    protected componentFactoryResolver: ComponentFactoryResolver
  ) {
  }

  ngOnInit() {
    this.loadComponent();
    this.session.isLoggedIn(() => this.detectChanges());
  }

  getCurrentUser() {
    return this.session.getLoggedInUser();
  }

  loadComponent() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(NotificationsToasterComponent),
      viewContainerRef = this.notificationsToasterHost.viewContainerRef;

    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentFactory);
    this.componentInstance = this.componentRef.instance;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
