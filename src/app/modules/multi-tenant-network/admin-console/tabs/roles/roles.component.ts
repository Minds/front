import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subscription, interval } from 'rxjs';
import { MultiTenantRolesView } from './roles.types';
import { MultiTenantRolesService } from '../../../services/roles.service';

/**
 * Domain settings tab for network admin console.
 */
@Component({
  selector: 'm-networkAdminConsole__roles',
  templateUrl: './roles.component.html',
  styleUrls: [
    './roles.component.ng.scss',
    '../../stylesheets/console.component.ng.scss',
  ],
})
export class NetworkAdminConsoleRolesComponent implements OnInit, OnDestroy {
  // subscriptions.
  private subscriptions: Subscription[] = [];
  /**
   * Allows us to use enum in the template
   */
  public multiTenantRolesView: typeof MultiTenantRolesView = MultiTenantRolesView;

  view$: BehaviorSubject<MultiTenantRolesView> = new BehaviorSubject<
    MultiTenantRolesView
  >(MultiTenantRolesView.PERMISSIONS);

  constructor(
    protected service: MultiTenantRolesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      // Get the view from the route
      if (params['view']) {
        this.view$.next(params['view']);
      }
    });

    this.service.fetchRolesAndPermissions();

    //  ojm this.subscriptions.push();
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
