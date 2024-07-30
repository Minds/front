import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  GetPermissionIntentsGQL,
  GetPermissionIntentsQuery,
  PermissionIntent,
  PermissionIntentTypeEnum,
  PermissionsEnum,
  SetPermissionIntentGQL,
  SetPermissionIntentMutation,
  SiteMembership,
} from '../../../../../../../../graphql/generated.engine';
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  Subscription,
  combineLatest,
  lastValueFrom,
  map,
  take,
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
import { ApolloQueryResult } from '@apollo/client';
import { ConfigsService } from '../../../../../../../common/services/configs.service';

/** Select box option type. */
export type PermissionHandlingSelectOption = {
  intentType: PermissionIntentTypeEnum;
  membershipGuid?: string;
};

/** Exported permission intent type. */
export type ExportedPermissionIntent = {
  permission_id: PermissionsEnum;
  intent_type: PermissionIntentTypeEnum;
  membership_guid: string;
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
  implements OnInit, OnDestroy
{
  /** Enum for use in template. */
  protected readonly PermissionIntentTypeEnum: typeof PermissionIntentTypeEnum =
    PermissionIntentTypeEnum;

  /** Enum for use in template. */
  protected readonly PermissionsEnum: typeof PermissionsEnum = PermissionsEnum;

  /** Site memberships. */
  protected readonly siteMemberships$: ReplaySubject<SiteMembership[]> =
    this.siteMembershipService.siteMemberships$;

  /** Whether intents are loaded. */
  private readonly permissionIntentsLoaded$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /** Whether data has been loaded. */
  protected readonly dataLoaded$: Observable<boolean> = combineLatest([
    this.siteMembershipService.initialized$,
    this.permissionIntentsLoaded$,
  ]).pipe(
    map(
      ([siteMembershipsLoaded, permissionIntentsLoaded]: [
        boolean,
        boolean,
      ]) => {
        return siteMembershipsLoaded && permissionIntentsLoaded;
      }
    )
  );

  /** Permission handling intents. */
  protected readonly permissionIntents$: BehaviorSubject<PermissionIntent[]> =
    new BehaviorSubject<PermissionIntent[]>([]);

  // subscriptions
  private getPermissionIntentsGqlSubscription: Subscription;

  constructor(
    private siteMembershipService: SiteMembershipService,
    private getPermissionIntentsGQL: GetPermissionIntentsGQL,
    private setPermissionIntentGQL: SetPermissionIntentGQL,
    private configs: ConfigsService,
    private toaster: ToasterService
  ) {}

  ngOnInit() {
    this.siteMembershipService.fetch();
    this.getPermissionIntentsGqlSubscription = this.getPermissionIntentsGQL
      .fetch(null, { fetchPolicy: 'no-cache' })
      .pipe(take(1))
      .subscribe(
        (response: ApolloQueryResult<GetPermissionIntentsQuery>): void => {
          if (!response?.data?.permissionIntents?.length) {
            this.toaster.error(
              'Failed to load permission intents. Please try again later.'
            );
            return;
          }
          this.permissionIntents$.next(response.data.permissionIntents);
          this.permissionIntentsLoaded$.next(true);
        }
      );
  }

  ngOnDestroy(): void {
    this.getPermissionIntentsGqlSubscription?.unsubscribe();
  }

  /**
   * Handle the change of a permission handling intent.
   * @param { Event } $event - The event that triggered the change.
   * @param { PermissionIntent } permissionIntent - The permission handling intent to update.
   */
  protected async onSelectorChange(
    $event: Event,
    permissionIntent: PermissionIntent
  ) {
    const selection: PermissionHandlingSelectOption = JSON.parse(
      ($event.target as HTMLInputElement).value
    );

    try {
      const result: MutationResult<SetPermissionIntentMutation> =
        await lastValueFrom(
          this.setPermissionIntentGQL.mutate({
            permissionId: permissionIntent.permissionId,
            intentType: selection.intentType,
            membershipGuid: selection.membershipGuid,
          })
        );

      if (!result?.data?.setPermissionIntent) {
        throw new Error('Failed to set permission handling intent');
      }

      this.updateLocalState(result.data.setPermissionIntent);

      this.toaster.success('Updated successfully.');
    } catch (e: unknown) {
      console.error(e);
      this.toaster.error('An unknown error occurred. Please try again later.');
    }
  }

  /**
   * Update the local state with the changed permission intent.
   * @param { PermissionIntent } changedPermissionIntent - The changed permission intent.
   * @returns { void }
   */
  private updateLocalState(changedPermissionIntent: PermissionIntent): void {
    let permissionIntents: PermissionIntent[] =
      this.permissionIntents$.getValue();

    permissionIntents.map((intent: PermissionIntent): PermissionIntent => {
      if (intent.permissionId === changedPermissionIntent.permissionId) {
        intent.intentType = changedPermissionIntent.intentType;
        intent.membershipGuid = changedPermissionIntent.membershipGuid;
      }
      return intent;
    });

    this.permissionIntents$.next(permissionIntents);

    this.configs.set(
      'permission_intents',
      permissionIntents.map(
        (intent: PermissionIntent): ExportedPermissionIntent => ({
          permission_id: intent.permissionId,
          intent_type: intent.intentType,
          membership_guid: intent.membershipGuid,
        })
      )
    );
  }
}
