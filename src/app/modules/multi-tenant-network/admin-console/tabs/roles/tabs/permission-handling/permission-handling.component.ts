import { Component, OnInit } from '@angular/core';
import {
  MultiTenantConfig,
  PermissionHandlingIntent,
  PermissionHandlingIntentTypeEnum,
  PermissionsEnum,
  SetPermissionHandlingIntentGQL,
  SetPermissionHandlingIntentMutation,
  SiteMembership,
} from '../../../../../../../../graphql/generated.engine';
import { MultiTenantNetworkConfigService } from '../../../../../services/config.service';
import {
  Observable,
  ReplaySubject,
  combineLatest,
  lastValueFrom,
  map,
} from 'rxjs';
import {
  AsyncPipe,
  JsonPipe,
  NgFor,
  NgIf,
  NgSwitch,
  NgSwitchCase,
} from '@angular/common';
import { CommonModule } from '../../../../../../../common/common.module';
import { SiteMembershipService } from '../../../../../../site-memberships/services/site-memberships.service';
import { MutationResult } from 'apollo-angular';
import { ToasterService } from '../../../../../../../common/services/toaster.service';

/** Select box option type */
export type PermissionHandlingSelectOption = {
  intentType: PermissionHandlingIntentTypeEnum;
  membershipGuid?: string;
};

/**
 * Permission handling section for tenant admin console. Allows the admin to choose which
 * actions happen when a user tries to interact with something that they do not have permission
 * to interact with.
 */
@Component({
  selector: 'm-networkAdminConsoleRoles__permissionHandling',
  templateUrl: './permission-handling.component.html',
  styleUrls: ['./permission-handling.component.ng.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    NgFor,
    NgIf,
    NgSwitch,
    NgSwitchCase,
    JsonPipe,
    CommonModule,
  ],
})
export class NetworkAdminConsoleRolesPermissionHandlingComponent
  implements OnInit
{
  /** Enum for use in template. */
  protected readonly PermissionHandlingIntentTypeEnum: typeof PermissionHandlingIntentTypeEnum =
    PermissionHandlingIntentTypeEnum;

  /** Enum for use in template. */
  protected readonly PermissionsEnum: typeof PermissionsEnum = PermissionsEnum;

  /** Site memberships */
  protected readonly siteMemberships$: ReplaySubject<SiteMembership[]> =
    this.siteMembershipService.siteMemberships$;

  /** Whether data has been loaded. */
  protected readonly dataLoaded$: Observable<boolean> = combineLatest([
    this.siteMembershipService.initialized$,
    this.multiTenantNetworkConfigService.configLoaded$,
  ]).pipe(
    map(
      ([siteMembershipsLoaded, multiTenantConfigLoaded]: [
        boolean,
        boolean,
      ]) => {
        return siteMembershipsLoaded && multiTenantConfigLoaded;
      }
    )
  );

  /** Permission handling intents. */
  protected readonly permissionHandlingIntents$: Observable<
    PermissionHandlingIntent[]
  > = this.multiTenantNetworkConfigService.config$.pipe(
    map((config: MultiTenantConfig) => config?.permissionHandlingIntents || [])
  );

  constructor(
    private multiTenantNetworkConfigService: MultiTenantNetworkConfigService,
    private siteMembershipService: SiteMembershipService,
    private setPermissionHandlingIntentGQL: SetPermissionHandlingIntentGQL,
    private toaster: ToasterService
  ) {}

  ngOnInit() {
    this.siteMembershipService.fetch();
    this.multiTenantNetworkConfigService.fetchConfig();
  }

  /**
   * Handle the change of a permission handling intent.
   * @param { Event } $event - The event that triggered the change.
   * @param { PermissionHandlingIntent } permissionHandlingIntent - The permission handling intent to update.
   */
  protected async onSelectorChange(
    $event: Event,
    permissionHandlingIntent: PermissionHandlingIntent
  ) {
    const selection: PermissionHandlingSelectOption = JSON.parse(
      ($event.target as HTMLInputElement).value
    );

    try {
      const result: MutationResult<SetPermissionHandlingIntentMutation> =
        await lastValueFrom(
          this.setPermissionHandlingIntentGQL.mutate({
            permissionId: permissionHandlingIntent.permissionId,
            intentType: selection.intentType,
            membershipGuid: selection.membershipGuid,
          })
        );

      if (!result?.data?.setPermissionHandlingIntent) {
        throw new Error('Failed to set permission handling intent');
      }

      const currentPermissionHandlingIntents: PermissionHandlingIntent[] =
        this.multiTenantNetworkConfigService.config$.getValue()
          ?.permissionHandlingIntents;

      this.multiTenantNetworkConfigService.updateLocalState({
        permissionHandlingIntents: currentPermissionHandlingIntents.map(
          (intent: PermissionHandlingIntent): PermissionHandlingIntent => {
            return intent.permissionId === permissionHandlingIntent.permissionId
              ? {
                  ...intent,
                  intentType: selection.intentType,
                  membershipGuid: selection.membershipGuid,
                }
              : intent;
          }
        ),
      });

      this.toaster.success('Updated successfully.');
    } catch (e: unknown) {
      console.error(e);
      this.toaster.error('An unknown error occurred. Please try again later.');
    }
  }
}
