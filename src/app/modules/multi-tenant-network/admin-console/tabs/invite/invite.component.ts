import { Component, OnInit, ViewChild } from '@angular/core';
import { MultiTenantInviteView } from './invite.types';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MultiTenantRolesService } from '../../../services/roles.service';
import { NetworkAdminConsoleInviteSendComponent } from './tabs/send/send.component';

@Component({
  selector: 'm-networkAdminConsole__invite',
  templateUrl: './invite.component.html',
  styleUrls: [
    './invite.component.ng.scss',
    '../../stylesheets/console.component.ng.scss',
  ],
})
export class NetworkAdminConsoleInviteComponent implements OnInit {
  /**
   * Allows us to use enum in the template
   */
  public multiTenantInviteView: typeof MultiTenantInviteView = MultiTenantInviteView;

  view$: BehaviorSubject<MultiTenantInviteView> = new BehaviorSubject<
    MultiTenantInviteView
  >(MultiTenantInviteView.SEND);

  constructor(
    private route: ActivatedRoute,
    private rolesService: MultiTenantRolesService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      // Get the view from the route
      if (params['view']) {
        this.view$.next(params['view']);
      }
    });

    this.rolesService.fetchRolesAndPermissions();
  }
}
